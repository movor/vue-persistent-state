var store = require('store')
var copy = require('deep-copy')

exports.install = function (Vue, initialState) {
  // get state from localStorage
  var state = {}
  for (var key in initialState) {
    var val = store.get(key, initialState[key])
    // initial population to localStorage
    store.set(key, val)
    state[key] = val
  }
  // make sure nested objects in initialState are not mutated
  state = copy(state)

  Vue.mixin({
    data: function () {
      return state
    },
    watch: createWatchers(state)
  })
  // make store API available through $store
  Vue.prototype.$store = store
}

function createWatchers (state) {
  var watch = {}
  for (var key in state) {
    watch[key] = {
      deep: true,
      handler: function (newValue, oldValue) {
        store.set(key, newValue)
      }
    }
  }
  return watch
}
