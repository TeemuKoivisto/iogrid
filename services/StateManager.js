class StateManager  {
  constructor(options) {
    this.channelGrid = options.channelGrid;
    this.stateRefs = options.stateRefs;
  }

  create(state) {
    var stateCellIndex = this.channelGrid.getCellIndex(state);
    var stateRef = {
      id: state.id,
      tcid: stateCellIndex, // Target cell index.
      type: state.type,
      create: state
    };
    if (state.swid != null) {
      stateRef.swid = state.swid;
    }
    this.stateRefs[state.id] = stateRef;
    return stateRef;
  }

  // You can only update through operations which must be interpreted
  // by your cell controllers (cell.js).
  update(stateRef, operation) {
    this.stateRefs[stateRef.id].op = operation;
  }

  delete(stateRef) {
    this.stateRefs[stateRef.id].delete = 1;
  }
}

module.exports = StateManager;
