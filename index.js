var schema = require('protobuf-schema')
var fs = require('fs')
var path = require('path')

var merge = function(a, b) {
  a.messages = a.messages.concat(b.messages)
  a.enums = a.enums.concat(b.enums)
  a.options = a.options.concat(b.options)
  return a
}

var readSync = function(filename, options) {
  options = options || {}

  if (!options.root_dir) options.root_dir = path.resolve(path.dirname(filename))

  if (!/\.proto$/i.test(filename) && !fs.existsSync(filename)) filename += '.proto'

  var sch = schema(fs.readFileSync(filename, 'utf-8'))
  var imports = [].concat(sch.imports || [])

  imports.forEach(function(i) {
    if (options.root_dir)  i = options.root_dir + "/" + i
    sch = merge(sch, readSync(i, options))
  })

  return sch
}

var read = function(filename, cb) {
  fs.exists(filename, function(exists) {
    if (!exists && !/\.proto$/i.test(filename)) filename += '.proto'

    //TODO: this doesn't respect the options.root_dir as well, im not going to edit the "async/recursive/whatever" loop
    fs.readFile(filename, 'utf-8', function(err, proto) {
      if (err) return cb(err)

      var sch = schema(proto)
      var imports = [].concat(sch.imports || [])

      var loop = function() {
        if (!imports.length) return cb(null, sch)

        read(path.resolve(path.dirname(filename), imports.shift()), function(err, ch) {
          if (err) return cb(err)
          sch = merge(sch, ch)
          loop()
        })
      }

      loop()
    })
  })
}

module.exports = read
module.exports.sync = readSync