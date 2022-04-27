Array.prototype.equals = function (array) {
  // if the other array is a falsy value, return
  if (array.constructor.name !== "Array") return false;

  // compare lengths - can save a lot of time
  if (this.length != array.length) return false;

  for (var i = 0, l = this.length; i < l; i++) {
    if (this[i] != array[i]) {
      return false;
    }
  }
  return true;
};
// Hide method from for-in loops
Object.defineProperty(Array.prototype, "equals", { enumerable: false });

export function treeGen(file, parsed) {
  let id = 0;

  (function () {
    if (typeof Object.prototype.uniqueId == "undefined") {
      Object.prototype.uniqueId = function () {
        if (typeof this.__uniqueid == "undefined") {
          this.__uniqueid = ++id;
        }
        return this.__uniqueid;
      };
    }
  })();

  let varmap = {};
  let varcount = 1;
  let tokencount = 0;
  let tokenmap = {};
  let strucmap = {};

  parsed.iterate({
    enter: (type, from, to, get) => {
      if (type.name === "Comment") return;
      let n = get();
      let nu = n.uniqueId();
      let p = n.parent;
      let varID = undefined;

      if (type.name === "VariableName") {
        let varname = file.slice(from, to);
        varID = varmap[varname];

        if (!varID) {
          varID = varcount;
          varmap[varname] = varcount;
          tokenmap[varcount] = [tokencount];
          varcount++;
        } else tokenmap[varID].push(tokencount);
        strucmap[nu] = { children: [varID], nodetype: type.id };
      } else {
        strucmap[nu] = { children: [], nodetype: type.id };
      }
      if (p && strucmap[p.uniqueId()]) {
        strucmap[p.uniqueId()].children.push(nu);
      }
      tokencount++;
    },
  });

  Object.prototype.uniqueId = undefined;
  return strucmap;
}

export function strucmapcompare(sm1, sm2) {
  function lenCompare() {
    return esm1.length === esm2.length;
  }

  function iterCompare() {
    let i = 0;
    function nodeCompare() {
      const v1 = esm1[i][1];
      const v2 = esm2[i][1];

      if (v1.varID) {
        return v1.varID === v2.varID;
      } else {
        if (!(v1.nodeType === v2.nodeType)) return false;
        return v1.children.equals(v2.children);
      }
    }

    for (i; i < esm1.length; i++) {
      if (!nodeCompare()) return false;
    }
    return true;
  }

  const esm1 = Object.entries(sm1);
  const esm2 = Object.entries(sm2);
  return lenCompare() && iterCompare();
}
