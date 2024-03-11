# Controller

## Standard Response from a Controller Method

- With data:

```js
res.status(<status-code>).json({
    message: "<success or error message>",
    data: <data>,
});
```

- Without data:

```js
res.status(<status-code>).json({
    message: "<success or error message>",
});
```
