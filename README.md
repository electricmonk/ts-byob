
# Build Your Own Builders

byob is a Typescript micro library to allow creating fluent object builders for your test data. 

## Usage:

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

We can create a product builder:

```typescript
const aProduct = builderFor<Product>({id: "0", name: "foo", price: 0, currency: "usd", photos: []});

const product1 = aProduct(); 
// {id: "0", name: "foo", price: 0, currency: "usd", photos: []}

const product2 = aProduct({name: bar});
 // {id: "0", name: "bar", price: 0, currency: "usd", photos: []}
```

Note that all defaults are the same scalar values provided upon creating the builder. If we want to create fresh values for each new object (for instance, current Date, random ID), we can provide a function initializer:

```typescript
const aProductWithRandomId = builderFor<Product>(() => ({id: nanoid(), name: "foo", price: 0, currency: "usd", photos: []}));

const product1 = aProduct(); 
// {id: <a random nanoid>, name: "foo", price: 0, currency: "usd", photos: []}

const product2 = aProduct();
// {id: <another random nanoid>, name: "bar", price: 0, currency: "usd", photos: []}
```
