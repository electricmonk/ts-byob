import { builderFor } from "../src";

describe('meta builder', () => {
  it('accepts defaults as object', () => {
    type Product = {
      id: number;
      name: string;
    }

    const aProduct = builderFor<Product>({ id: 0, name: ''});

    expect(aProduct()).toEqual({id: 0, name: ''});
  });

  it('accepts defaults as a function', () => {
    type Product = {
      id: number;
      name: string;
    }

    let seq = 0;
    const aProduct = builderFor<Product>(() => ({ id: seq++, name: ''}));

    expect(aProduct()).toEqual({id: 0, name: ''});
    expect(aProduct()).toEqual({id: 1, name: ''});
  });

  it('overrides defaults', () => {
    type Product = {
      id: number;
      name: string;
    }

    const aProduct = builderFor<Product>({ id: 0, name: 'Eddie'});

    expect(aProduct({id: 666})).toEqual({id: 666, name: 'Eddie'});
  });

  it('provides sequences', () => {
    type A = {
      id: number;
    }

    const aProduct = builderFor<A>(({next}) => ({ id: next("id"),}));
    expect(aProduct()).toEqual({id: 0});
    expect(aProduct()).toEqual({id: 1});
  });

  it('creates a separate sequence for each builder', () => {
    type A = {
      id: number;
    }

    expect(builderFor<A>(({next}) => ({ id: next("id")}))()).toEqual({id: 0});
    expect(builderFor<A>(({next}) => ({ id: next("id")}))()).toEqual({id: 0});
  });
})