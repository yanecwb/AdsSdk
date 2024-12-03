# Introduction to Adspaw Developer Function Integration

**Welcome to Adspaw, a powerful advertising platform tailored for traffic owners. Our goal is to help you optimize your earnings by offering easy integration and smart advertising management. In this article, we will highlight the key features of the Adspaw platform available to traffic owners.**

## Confirm the interactive logic of advertising display

|Type|description|
|:--:|--|
|One more chance|When players lose in the game, they have the option to obtain ability that allow them to continue playing.`|
|Boosters|Give users some boosters, such as a mining multiplier, a speed multiplier, reduce downtime, use an existing booster in your game or create a new one.|
|Use ads as a currency|If the user does not have enough money, offer to show ads and add the missing amount of money.like Lucky turntable|
|any|The examples above are not the only possible ones. There may be a more suitable place for advertising in your application.|

## Usage

- Via NPM

```javascript
npm install adspaw
```

```javascript
yarn add adspaw
```

- Via CDN

```javascript
https://cdn.jsdelivr.net/npm/adspaw@latest/dist/index.min.js
```

<br/>

```javascript
const instanceAds = await window.entryAds(); //Get advertising instances in advance

// During the testing phase, passing in parameters can obtain the test advertisement:entryAds('',true)

try {
  const done = await instanceAds.show({
    onAdShow: () => {
     //When the advertisement is successfully displayed
    },
    onAdClick: () => {
     //When an advertisement is clicked
    },
    onAdComplete: () => {
     //When the ADS advertising task is completed
    },
  });
  
  // done --> The type of done is a Boolean value. If it is true, users can be rewarded (for your app)
  // Of course, you can also incorporate the following logic into the onAdComplete callback function
  // todo
} catch (error) {
  // user get error during playing ad
  // do nothing or whatever you want
}

```

> ⚠️ NOTICE⚠️
Please ensure that the plugin is introduced correctly and that there are **entryAds **in the window