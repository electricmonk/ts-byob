
<img src="assets/logo.png" alt="Build Your Own Builders" width="300"/>

# Build Your Own Builders

byob is a Typescript micro library for creating fluent object builders for your test data.

# Table of Contents

- [Build Your Own Builders](#build-your-own-builders)
- [Table of Contents](#table-of-contents)
- [Example](#example)
- [Motivation](#motivation)
- [Installation](#installation)
- [Usage](#usage)
  - [Scalar initializer](#scalar-initializer)
  - [Function initializer](#function-initializer)
  - [Sequences](#sequences)
- [Contributing](#contributing)

# Example

```typescript
// some.spec.ts
test('product list returns products according to filter', () => {
  const p1 = aProduct({name: "Banana"});
  const p2 = aProduct({name: "Bandana"});
  const p3 = aProduct({name: "Apple"});
  const catalog = new InMemoryProductCatalog([p1, p2, p3]);

  const app = render(<Gallery catalog={catalog}/>);
  fireEvent.change(app.getByTestId('name-filter'), {target: {value: 'Ban'}};

  expect(app.queryByText(p1.name)).toBeTruthy();
  expect(app.queryByText(p2.name)).toBeTruthy();
  expect(app.queryByText(p3.name)).toBeFalsy();
})

// testkit.ts
export const aProduct = builderFor<Product>({
  id: "0", name: "", price: 0, currency: "usd", dateCreated: new Date()
});

export class InMemoryProductCatalog implements ProductCatalog {
  // ...
}

// shop.ts
type Product {
  id: string;
  name: string;
  dateCreated: Date;
  price: number;
  currency: "usd" | "eur" | "ils";
}

interface ProductCatalog {
  findAll(): Promise<Product[]>
}

export const Gallery: React.FC<{catalog: ProductCatalog}> = ({catalog}) => {
  //...
}
```

# Motivation

Tests that depend on static fixtures are harder to read, understand and maintain. This [blog post](https://www.shaiyallin.com/post/beautiful-object-builders-in-typescript) started to develop the idea, and this library provides a simple, DRY way to create builders.

# Installation

```sh
npm install -D ts-byob
```

or

```sh
yarn add -D ts-byob
```

# Usage

Given a type `Product`:

```typescript
type Product = {
  id: string,
  name: String,
  price: number, 
  currency: "usd" | "eur" | "ils",
  photos: Photo[],
}
```

## Scalar initializer

If you pass an object to `builderFor<T>`, the object's properties will be used as defaults for all objects generated by the resulting builder:

```typescript
const aProduct = builderFor<Product>({id: "0", name: "foo", price: 0, currency: "usd", photos: []});

const product1 = aProduct(); 
// {id: "0", name: "foo", price: 0, currency: "usd", photos: []}

const product2 = aProduct({name: bar});
 // {id: "0", name: "bar", price: 0, currency: "usd", photos: []}
```

## Function initializer

If we want to create fresh values for each new object (for instance, current Date, random ID), we can provide a function initializer:

```typescript
const aProductWithRandomId = builderFor<Product>(() => ({id: nanoid(), name: "foo", price: 0, currency: "usd", photos: []}));

const product1 = aProductWithRandomId(); 
// {id: <a random nanoid>, name: "foo", price: 0, currency: "usd", photos: []}

const product2 = aProductWithRandomId();
// {id: <another random nanoid>, name: "bar", price: 0, currency: "usd", photos: []}
```

## Sequences

The function initializer can use a per-builder context to generate running sequences, useful for numeric IDs.  

```typescript
const aProduct = builderFor<Product>(({next}) => 
  ({id: next("id"), name: "foo", price: 0, currency: "usd", photos: []}})
);

const anOrder = builderFor<Order>(({next}) => 
  ({id: next("id"), items: []}})
);

const product1 = aProduct(); 
// {id: 1, name: "foo", price: 0, currency: "usd", photos: []}

const product2 = aProduct();
// {id: 2, name: "foo", price: 0, currency: "usd", photos: []}

const order = anOrder({products: [product1, product2]});
// {id: 1, products: [{...}, {...}]}

```

# Contributing

We actively welcome pull requests and proposed changes to the code base. Please follow these steps when contributing.

1. Please fork and branch from `main`.
2. Comment your code extensively, and update the README when expected.
3. Add unit tests where applicable.
4. All existing testing suites must pass and no linter errors should occur.
