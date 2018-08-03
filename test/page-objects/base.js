const { expect } = require('test/chai-sinon');
const config = require('config');

const testUrl = config.get('testUrl');

class BasePage {
  constructor(page) {
    this.page = page;
    this.pagePath = '/';
  }

  async visitPage() {
    await this.page.goto(`${testUrl}${this.pagePath}`);
  }

  verifyPage() {
    expect(this.page.url()).to.equal(`${testUrl}${this.pagePath}`);
  }

  async getHeading() {
    const heading = await this.page.$eval('h1', el => el.innerHTML);
    return heading;
  }
}

module.exports = BasePage;
