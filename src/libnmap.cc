#include <node.h>
#include <v8.h>

#include "./libnmap.h"

using namespace node;
using namespace v8;

Handle<Value> libnmap::libnmap(const Arguments& args) {
	HandleScope scope;
	return scope.Close(Undefined());
}

void libnmap::Init (Handle<Object> exports) {
	exports->Set(String::NewSymbol("masscan"),
			FunctionTemplate::New(libnmap)->GetFunction());
}

extern "C" {
	NODE_MODULE(nmap, libnmap::Init)
}