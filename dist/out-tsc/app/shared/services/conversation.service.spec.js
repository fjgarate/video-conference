"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var testing_1 = require("@angular/core/testing");
var conversation_service_1 = require("./conversation.service");
describe('ConversationService', function () {
    beforeEach(function () { return testing_1.TestBed.configureTestingModule({}); });
    it('should be created', function () {
        var service = testing_1.TestBed.get(conversation_service_1.ConversationService);
        expect(service).toBeTruthy();
    });
});
//# sourceMappingURL=conversation.service.spec.js.map