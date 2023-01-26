import { CUSTOM_RESOURCE_CONSTANTS, RESOURCE_CONSTANTS, MOBILE_SCREENS } from "utility";
const sleep = duration => new Promise(resolve => setTimeout(() => resolve(), duration));

const waitForVisible = key => new Promise(resolve => {
  console.log("waitForVisible", key);
  let interval = setInterval(async () => {
    // console.log("setInterval called");
    // if (isVisible) {
    //   clearInterval(interval);
    //   resolve(true);
    // }
  }, 1000);
})

describe('Language selection flow', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  // testpage screen 
  // it('Navigate testpage screen', async () => {
  //   await waitFor(element(by.text('ClickMe'))).toBeVisible();
  //   await element(by.id("MyButton")).tap();
  //   await sleep(2000);
  //   await expect(element(by.text('200'))).toBeVisible();
  //   await element(by.id("Navigate")).tap();
  //   await sleep(3000);
  // });

  // Language screen
  it('Navigate language screen', async () => {

    await waitFor(element(by.id('1'))).toBeVisible()
    await element(by.id("1")).tap();
    await element(by.text(CUSTOM_RESOURCE_CONSTANTS.NEXT)).tap();
    await sleep(2000);
    await expect(element(by.id(RESOURCE_CONSTANTS.FORGOT_PASSWORD))).toBeVisible();
  });

  // sign in screen 
  it('Navigate sign in screen', async () => {
    await waitFor(element(by.id(RESOURCE_CONSTANTS.SIGNIN))).toBeVisible();
    await element(by.id(RESOURCE_CONSTANTS.SIGNIN)).tap();
    await sleep(3000);
    await expect(element(by.id(RESOURCE_CONSTANTS.SET_PASSCODE))).toBeVisible();
  });

  // passcode screen
  it('write set passcode and go to confirm passcode', async () => {
    await waitFor(element(by.id(RESOURCE_CONSTANTS.SET_PASSCODE))).toBeVisible();
    await waitFor(element(by.id('OTPInputView'))).toExist();

    await element(by.text('').withAncestor(by.id('OTPInputView'))).atIndex(0).replaceText('1');
    await element(by.text('').withAncestor(by.id('OTPInputView'))).atIndex(0).replaceText('2');
    await element(by.text('').withAncestor(by.id('OTPInputView'))).atIndex(0).replaceText('3');
    await element(by.text('').withAncestor(by.id('OTPInputView'))).atIndex(0).replaceText('4');

    await sleep(2000);

    await expect(element(by.id(RESOURCE_CONSTANTS.CONFIRM_PASSCODE))).toBeVisible();
  });

  // confirm passcode
  it('write confirm passcode and go to home', async () => {
    await waitFor(element(by.id('OTPInputView'))).toExist();

    await element(by.text('').withAncestor(by.id('OTPInputView'))).atIndex(0).replaceText('1');
    await element(by.text('').withAncestor(by.id('OTPInputView'))).atIndex(0).replaceText('2');
    await element(by.text('').withAncestor(by.id('OTPInputView'))).atIndex(0).replaceText('3');
    await element(by.text('').withAncestor(by.id('OTPInputView'))).atIndex(0).replaceText('4');

    await sleep(3000);

    await expect(element(by.id(RESOURCE_CONSTANTS.WELCOME))).toBeVisible();
  });

  // students
  it('Go to students page and navigate Add patient screen', async () => {
    await element(by.text(MOBILE_SCREENS.STUDENTS)).tap();

    await sleep(3000);

    await expect(element(by.id(RESOURCE_CONSTANTS.ADD_PATIENT))).toBeVisible();
  });

  // Add patient
  it('Go to Add patient and add new patient', async () => {
    await element(by.id(RESOURCE_CONSTANTS.ADD_PATIENT)).tap();

    await sleep(2000);
    await element(by.id(RESOURCE_CONSTANTS.FIRST_NAME)).replaceText('Shani');
    await element(by.id(RESOURCE_CONSTANTS.LAST_NAME)).replaceText('Tiwari');
    await element(by.id(RESOURCE_CONSTANTS.ADDRESS_LINE1)).replaceText('Bhayender EAST');
    await element(by.id(RESOURCE_CONSTANTS.AGE)).replaceText('34');
    await element(by.id(RESOURCE_CONSTANTS.PHONE_NUMBER)).replaceText('9137157524');
    await element(by.id(RESOURCE_CONSTANTS.PINCODE)).replaceText('401105');
    await element(by.id(RESOURCE_CONSTANTS.DOB)).tap();
    await element(by.text('1932')).swipe('up');
    await element(by.text('CONFIRM')).tap();
    await element(by.text(RESOURCE_CONSTANTS.GENDER)).tap();
    await element(by.text('Male')).tap();
    await element(by.id(RESOURCE_CONSTANTS.SAVE)).tap();

    await expect(element(by.text('Student saved successfully'))).toBeVisible();
  });
});