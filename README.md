# Razorpayx Node SDK

Unofficial nodejs library for [Razorpayx API](https://razorpay.com/docs/razorpayx/api/).

Read up here for getting started and understanding the payout flow with Razorpayx: <https://razorpay.com/docs/razorpayx/api/get-started/>


## Documentation

Documentation of Razorpay's API and their usage is available at <https://razorpay.com/docs/razorpayx/api/>

### Basic Usage

Instantiate the razorpayx instance with `key_id` & `key_secret`.
```js
var instance = new Razorpayx({
  key_id: 'YOUR_KEY_ID',
  key_secret: 'YOUR_KEY_SECRET',
});
```

```
Note: If you are an existing Razorpay merchant, you can use your existing API key with RazorpayX.
```
To generate your API Keys:

1. Log into your RazorpayX Dashboard.
2. Navigate to Account Settings → API Keys and Webhooks.
3. Click Generate Key.
4. API Keys are generated for your business account.



The resources can be accessed via the instance. All the methods invocations follows the namespaced signature

```js
// API signature
// {razorpayxInstance}.{resourceName}.{methodName}(resourceId [, params])

// example
instance.contacts.fetch(contactId);
```
