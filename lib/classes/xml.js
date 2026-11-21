/*!
 * libnmap
 * Copyright(c) 2013 Jason Gerfen <jason.gerfen@gmail.com>
 * License: NPSL-0.95
 */

'use strict'

const entities = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'"
};

// Sets an own property. A name from the report, such as __proto__, cannot
// change the prototype of the object.
const define = (obj, name, value) => Object.defineProperty(obj, name, {
  value, enumerable: true, writable: true, configurable: true
});

class xml {
  decode(str) {
    if (str.indexOf('&') === -1)
      return str;

    return str.replace(/&(#x[0-9a-fA-F]+|#[0-9]+|[a-zA-Z]+);/g, (all, name) => {
      if (name[0] !== '#')
        return entities.hasOwnProperty(name) ? entities[name] : all;

      const code = (name[1] === 'x') ?
        parseInt(name.slice(2), 16) : parseInt(name.slice(1), 10);

      // A surrogate alone is not a character, and gives a string that is
      // not well-formed.
      if (code > 0x10ffff || (code >= 0xd800 && code <= 0xdfff))
        return all;

      return String.fromCodePoint(code);
    });
  }

  attributes(str) {
    const regex = /([^\s=\/]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g;
    let result = null;
    let match;

    while ((match = regex.exec(str)) !== null) {
      result = result || {};
      define(result, match[1], this.decode(match[2] !== undefined ?
        match[2] : match[3]));
    }

    return result;
  }

  close(node) {
    const obj = node.obj;

    if (Object.keys(obj).length === 0)
      return node.text;

    if (!/\S/.test(node.text))
      return obj;

    obj._ = node.text;

    return obj;
  }

  parse(str) {
    const stack = [];
    const result = {};
    const length = str.length;
    let pos = 0;

    const find = (what, from) => {
      const idx = str.indexOf(what, from);

      if (idx === -1)
        throw new Error(`XML report is not complete: no '${what}' found`);

      return idx;
    };

    while (pos < length) {
      const lt = str.indexOf('<', pos);
      const top = stack[stack.length - 1];

      if (lt !== pos) {
        const end = (lt === -1) ? length : lt;

        if (top)
          top.text += this.decode(str.slice(pos, end));

        pos = end;
        continue;
      }

      if (str.startsWith('<!--', pos)) {
        pos = find('-->', pos + 4) + 3;

      } else if (str.startsWith('<![CDATA[', pos)) {
        const end = find(']]>', pos + 9);

        if (top)
          top.text += str.slice(pos + 9, end);

        pos = end + 3;

      } else if (str.startsWith('<?', pos)) {
        pos = find('?>', pos + 2) + 2;

      } else if (str.startsWith('<!', pos)) {
        const gt = find('>', pos);
        const bracket = str.indexOf('[', pos);

        pos = (bracket !== -1 && bracket < gt) ?
          find('>', find(']', bracket)) + 1 : gt + 1;

      } else if (str[pos + 1] === '/') {
        const gt = find('>', pos);
        const name = str.slice(pos + 2, gt).trim();
        const node = stack.pop();

        if (!node || node.name !== name)
          throw new Error(`XML report is not valid: unexpected </${name}>`);

        this.add(stack, result, name, this.close(node));
        pos = gt + 1;

      } else {
        let gt = pos + 1;
        let quote = '';

        for (; gt < length; gt++) {
          const c = str[gt];

          if (quote) {
            if (c === quote) quote = '';
          } else if (c === '"' || c === "'") {
            quote = c;
          } else if (c === '>') {
            break;
          }
        }

        if (gt >= length)
          throw new Error("XML report is not complete: no '>' found");

        const empty = (str[gt - 1] === '/');
        const tag = str.slice(pos + 1, empty ? gt - 1 : gt);
        const space = tag.search(/\s/);
        const name = (space === -1) ? tag : tag.slice(0, space);
        const attrs = (space === -1) ? null : this.attributes(tag.slice(space));
        const node = { name, obj: {}, text: '' };

        if (attrs)
          node.obj.item = attrs;

        if (empty)
          this.add(stack, result, name, this.close(node));
        else
          stack.push(node);

        pos = gt + 1;
      }
    }

    if (stack.length > 0)
      throw new Error(`XML report is not complete: no </${stack.pop().name}>`);

    return result;
  }

  add(stack, result, name, value) {
    if (stack.length === 0) {
      define(result, name, value);
      return;
    }

    const parent = stack[stack.length - 1].obj;

    if (!Object.prototype.hasOwnProperty.call(parent, name))
      define(parent, name, []);

    parent[name].push(value);
  }
}

module.exports = new xml;
