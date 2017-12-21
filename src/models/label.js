class Label {
  constructor(label) {
    // assign passed in details to label object
    Object.keys(label).forEach((key) => {
      this[key] = label[key];
    });
  }
}

Label.FORMAT_OPTIONS = {
  PDF: 'pdf',
  ZPL: 'zpl',
};

Label.LAYOUT_OPTIONS = {
  FOUR_BY_SIX: '4x6',
  LETTER: 'letter',
};

Label.STATUS_OPTIONS = {
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  ERROR: 'error',
  VOIDED: 'voided',
};

export {
  Label
}
