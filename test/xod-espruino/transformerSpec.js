
import { expect } from 'chai';
import { transform } from 'xod-espruino/transformer'

describe('Transformer', function() {
  it('should transform empty json to empty node list', function() {
    const nodes = transform({});
    expect(nodes).to.be.eql({});
  });

  it('should join node and node type', function() {
    const nodes = transform({
      nodes: {
        42: {
          id: 42,
          typeId: 777,
        },
      },
      nodeTypes: {
        777: {
          id: 777,
          pure: true,
          setup: 'module.exports = function(fire) {};',
          evaluate: 'module.exports = function(inputs) { return {valueOut: valueIn + 100}; };',
          pins: {
            valueIn: {
              direction: 'input',
              key: 'valueIn',
              type: 'number',
            },
            valueOut: {
              direction: 'output',
              key: 'valueOut',
              type: 'number',
            },
          },
        },
      },
    });

    expect(nodes).to.be.eql({
      42: {
        id: 42,
        setup: 'module.exports = function(fire) {};',
        evaluate: 'module.exports = function(inputs) { return {valueOut: valueIn + 100}; };',
        pure: true,
        inputTypes: {
          valueIn: Number,
        },
        outLinks: {},
      },
    });
  });
});
