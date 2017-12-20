class Batch {
    constructor() {

    }

}

Batch.STATUS_OPTIONS = {
    OPEN: "open",
    QUEUED: "queued", 
    COMPLETED: "completed", 
    PROCESSING: "processing", 
    ARCHIVED: "archived", 
    INVALID: "invalid", 
    COMPLETED_WITH_ERRORS: "completed_with_errors"
}

module.exports = Batch;