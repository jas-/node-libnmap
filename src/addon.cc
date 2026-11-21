/* N-API binding: run(args) calls nmap_main() one time. Use it only from lib/worker.js.
 *
 * Nmap keeps its state in globals and calls exit() on errors, so a process can
 * run nmap_main() one time only. lib/worker.js gives each scan its own process. */
#define NAPI_VERSION 8
#include <node_api.h>

#include <locale.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#include "nmap.h"
#include "NmapOps.h"

extern NmapOps o;
extern void set_program_name(const char *name);

static bool nmap_used = false;

static napi_value
Run(napi_env env, napi_callback_info info)
{
    size_t argc = 1;
    napi_value arg, item, result;
    bool is_array = false;
    uint32_t length = 0, i;
    char **argv;
    int rc;

    if (napi_get_cb_info(env, info, &argc, &arg, NULL, NULL) != napi_ok
        || argc < 1
        || napi_is_array(env, arg, &is_array) != napi_ok || !is_array
        || napi_get_array_length(env, arg, &length) != napi_ok) {
        napi_throw_type_error(env, NULL, "run(args) needs an array of strings");
        return NULL;
    }
    if (nmap_used) {
        napi_throw_error(env, "ERR_NMAP_USED",
            "nmap_main() can run one time in a process. Start a new worker.");
        return NULL;
    }

    /* argv[0] is the program name, as on a command line. */
    argv = (char **)calloc((size_t)length + 2, sizeof(char *));
    if (argv == NULL) {
        napi_throw_error(env, NULL, "out of memory");
        return NULL;
    }
    argv[0] = strdup("nmap");
    for (i = 0; i < length; i++) {
        napi_valuetype type;
        size_t size = 0;

        if (napi_get_element(env, arg, i, &item) != napi_ok
            || napi_typeof(env, item, &type) != napi_ok
            || type != napi_string
            || napi_get_value_string_utf8(env, item, NULL, 0, &size) != napi_ok
            || (argv[i + 1] = (char *)malloc(size + 1)) == NULL) {
            napi_throw_type_error(env, NULL, "every argument must be a string");
            return NULL;
        }
        napi_get_value_string_utf8(env, item, argv[i + 1], size + 1, &size);
    }

    /* The same steps as main() in upstream main.cc. */
    nmap_used = true;
#ifdef __APPLE__
    setprogname("nmap"); /* getopt() error messages print this name */
#endif
    o.locale = strdup(setlocale(LC_CTYPE, NULL));
    set_program_name(argv[0]);
    rc = nmap_main((int)length + 1, argv);

    fflush(stdout);
    fflush(stderr);
    napi_create_int32(env, rc, &result);
    return result;
}

static napi_value
Version(napi_env env, napi_callback_info info)
{
    napi_value result;
    (void)info;
    napi_create_string_utf8(env, NMAP_VERSION, NAPI_AUTO_LENGTH, &result);
    return result;
}

static napi_value
Init(napi_env env, napi_value exports)
{
    napi_property_descriptor props[] = {
        { "run", NULL, Run, NULL, NULL, NULL, napi_default, NULL },
        { "version", NULL, Version, NULL, NULL, NULL, napi_default, NULL },
    };
    napi_define_properties(env, exports, sizeof(props) / sizeof(props[0]), props);
    return exports;
}

NAPI_MODULE(NODE_GYP_MODULE_NAME, Init)
