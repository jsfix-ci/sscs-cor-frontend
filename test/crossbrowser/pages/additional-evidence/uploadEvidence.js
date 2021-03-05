const content = require('locale/content');

function uploadEvidence() {
    const I = this;

    I.amOnPage('/additional-evidence');
    I.see(content.en.common.provideInformationOnline, "[for='additional-evidence-option-1']");
    I.click('#additional-evidence-option-1');
    I.click('[name="continue"]');
    I.fillField('#question-field', 'this is a test');
    I.click('#submit-statement');
}

function uploadWelshEvidence() {
    const I = this;

    I.amOnPage('/additional-evidence');
    I.see('Darparu eich gwybodaeth ar-lein', "[for='additional-evidence-option-1']");
    I.click('#additional-evidence-option-1');
    I.click('Parhau');
    I.fillField('#question-field', 'this is a welsh test');
    I.click("Cyflwyno eich datganiad i'r tribiwnlys");
}



module.exports = { uploadEvidence, uploadWelshEvidence }