import { test } from "@playwright/test";
import faker from "faker";
import moment from "moment";
import randomFile from 'select-random-file';
import util from 'util';

const submitForm = true;

const getImg = util.promisify(randomFile);

test("fill out form", async ({ page }) => {
  //const browser = await firefox.launch();
  //const page = await browser.newPage();

  let img = "./imgs/" + await getImg("./imgs/");

  let states = [`AL`,`AK`,`AZ`,`AR`,`CA`,`CO`,`CT`,`DE`,`DC`,`FL`,`GA`,`HI`,`ID`,`IL`,`IN`,`IA`,`KS`,`KY`,`LA`,`ME`,`MD`,`MA`,`MI`,`MN`,`MS`,`MO`,`MT`,`NE`,`NV`,`NH`,`NJ`,`NM`,`NY`,`NC`,`ND`,`OH`,`OK`,`OR`,`PA`,`RI`,`SC`,`SD`,`TN`,`TX`,`UT`,`VT`,`VA`,`WA`,`WV`,`WI`,`WY`]
  let state = faker.address.stateAbbr()
  let stateIndex = states.indexOf(state) +1;
  let email = `${faker.random.word()}@healthysupps.club`;
  let birthdate = moment(faker.date.past(faker.datatype.number(40), (moment()).add(-21, "year").toDate()));
  let f = {
    url: "https://us-d.wayin.com/display/container/dc/9c0f01cd-1143-4dfe-a4be-eea3ffcac5fd/details?mode=responsive",
  };

  // Go to https://www.mycooler.com/en/ULTRAbeerrun.html
  await page.goto(
    "https://us-d.wayin.com/display/container/dc/9c0f01cd-1143-4dfe-a4be-eea3ffcac5fd/details?mode=responsive",
    { timeout: 60000 }
  );
  // Upload stella-3.jpg
  await page
    .frame(f)
    .setInputFiles('input[name="ngxUserUpload"]', img);
  // Click [placeholder="First Name"]
  // Fill [placeholder="First Name"]
  await page
    .frame(f)
    .fill('[placeholder="First Name"]', faker.name.firstName());
  await page.frame(f).fill('[placeholder="Last Name"]', faker.name.lastName());
  await page.frame(f).fill('[placeholder="Day"]', birthdate.format("DD"));
  await page.press(`[placeholder="Day"]`, "Tab");

  await page.click(`input[data-api-ignore="date_of_birth_month"]`);
  for (let index = 0; index < birthdate.month() + 1; index++) {
    await page.press(`input[data-api-ignore="date_of_birth_month"]`, "ArrowDown");
  }
  await page.press(`input[data-api-ignore="date_of_birth_month"]`, "Enter");
    //.selectOption(`#date_of_birth_month`, birthdate.format("MM"));
  await page.frame(f).fill('[placeholder="Year"]', birthdate.format("yyyy"));
  await page
    .frame(f)
    .fill('[placeholder="Street Address"]', faker.address.streetAddress());
  await page.frame(f).fill('[placeholder="City"]', faker.address.city());

  await page.click(`input[data-api-ignore="address_State"]`);
  for (let index = 0; index < stateIndex; index++) {
    await page.press(`input[data-api-ignore="address_State"]`, "ArrowDown");
  }
  await page.press(`input[data-api-ignore="address_State"]`, "Enter");

  await page.frame(f).fill('[placeholder="Zip"]', faker.address.zipCodeByState(state));
  await page.frame(f).fill('[placeholder="me@email.com"]', email);
  await page.frame(f).fill('input[name="phone"]', faker.phone.phoneNumber("(###)###-####"));
  await page.frame(f).check('input[name="terms_and_conditions"]');

  await page.screenshot({ path: `screenshot-form.png`, fullPage: true });
  //await browser.close();

  if(submitForm){
    await page.click(`button.xSubmit`);
    await page.waitForTimeout(5000);
    await page.screenshot({ path: `screenshot-success.png`, fullPage: true });
  }
});
