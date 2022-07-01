export class ConversationWebhookBody {
    MessagingServiceSid: string;
    RetryCount: string;
    EventType: string;
    State: string;
    Attributes: string;
    MessagingBinding: {
        ProxyAddress: string;
        Address: string;
    };
    DateCreated: string;
    ChatServiceSid: string;
    AccountSid: string;
    Source: string;
    ConversationSid: string;
}

export class ScopedConversationBody {
    MessagingServiceSid: string;
    EventType: string;
    Attributes: string;
    DateCreated: string;
    Index: string;
    MessageSid: string;
    AccountSid: string;
    Source: string;
    RetryCount: string;
    WebhookType: string;
    Author: string;
    ParticipantSid: string;
    Body: string;
    WebhookSid: string;
    ConversationSid: string;
}

export class WebhookStatusResponse {
    status: 'ok';
}
