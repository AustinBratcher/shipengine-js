class Batch {
  constructor(batch) {
    // assign passed in details to batch object
    Object.keys(batch).forEach((key) => {
      this[key] = batch[key];
    });
  }
}

Batch.STATUS_OPTIONS = {
  OPEN: 'open',
  QUEUED: 'queued',
  COMPLETED: 'completed',
  PROCESSING: 'processing',
  ARCHIVED: 'archived',
  INVALID: 'invalid',
  COMPLETED_WITH_ERRORS: 'completed_with_errors',
};

export {
  Batch
}
