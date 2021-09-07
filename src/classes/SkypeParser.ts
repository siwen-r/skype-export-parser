import { Conversation, LegacyQuote, Message } from "@/types/SkypeExport";

export class SkypeParser {

  private getXMLRoot(content: string): HTMLElement {
    const parser = new DOMParser();
    const doc = parser.parseFromString( `<xml>${content}</xml>`, "application/xml");

    return doc.documentElement;
  }

  public parseConversation(conversation: Conversation) {
    conversation.MessageList = this.parseMessages(conversation.MessageList);

    return conversation;
  }

  public parseMessages(messages: Message[]) {
    return messages.map(element => this.parseMessage(element));
  }

  public parseMessage(message: Message) {
    try {
      if (message.messagetype == 'Event/Call') { message.partlist = this.parseCallContent(message.content); }
      if (message.messagetype == 'Text' || message.messagetype == 'RichText') {
        message.quote = this.parseQuoteContent(message.content);
        message.em = this.parseEM(message.content);

        /*
        message.content = message.content.replaceAll(/\r\n|\n|\r]/g, '') // FIX replaces all line breaks even those inside the actual message
        message.content = message.content.replace(/<quote (.*)<\/quote>/g, '')
        message.content = message.content.replace(/<e_m(.*)<\/e_m>/g, '')
        message.content = message.content.trim()
        */
      }
    } catch (e) {
      // ignore for now
      console.log(`Message with the id '${message.id}' has produced an exception`)
      console.log(e)
    }

    return message;
  }

  private parseCallContent(xml: string) {
    const xmlRoot = this.getXMLRoot(xml);
    if (xmlRoot.getElementsByTagName('partlist').length > 0) {
      const xmlPartlist = xmlRoot.getElementsByTagName('partlist')[0];

      const parts = [];
      for (var j = 0; j < xmlPartlist.getElementsByTagName('part').length; j++) {
        const xmlPart = xmlPartlist.getElementsByTagName('part')[j];

        let duration = undefined
        if (xmlPart.getElementsByTagName('duration').length > 0)
          duration = xmlPart.getElementsByTagName('duration')[0].textContent

        parts.push({ identity: xmlPart.getAttribute('identity'), name: xmlPart.getElementsByTagName('name')[0].textContent, duration: duration })
      }

      return { type: xmlPartlist.getAttribute('type'), alt: xmlPartlist.getAttribute('alt'), callId: xmlPartlist.getAttribute('callId'), part: parts };
    } else return undefined
  }
  private parseQuoteContent(xml: string) {
    const xmlRoot = this.getXMLRoot(xml);
    if (xmlRoot.getElementsByTagName('quote').length > 0) {
      const xmlQuote = xmlRoot.getElementsByTagName('quote')[0];

      const legecyQuotes: LegacyQuote[] = []
      for (var j = 0; j < xmlQuote.getElementsByTagName('legacyquote').length; j++) {
        legecyQuotes.push({ content: xmlQuote.getElementsByTagName('legacyquote')[j].textContent })
      }

      return {
        author: xmlQuote.getAttribute('author'),
        authorname: xmlQuote.getAttribute('authorname'),
        timestamp: xmlQuote.getAttribute('timestamp'),
        conversation: xmlQuote.getAttribute('conversation'),
        messageid: xmlQuote.getAttribute('messageid'),
        cuid: xmlQuote.getAttribute('cuid'),
        legacyquote: legecyQuotes,
        content: xmlQuote.textContent
      }

    } else return undefined
  }

  private parseEM(xml: string) {
    const xmlRoot = this.getXMLRoot(xml);
    if (xmlRoot.getElementsByTagName('e_m').length > 0) {
      const xmlEM = xmlRoot.getElementsByTagName('e_m')[0];

      return {
        a: xmlEM.getAttribute('a'),
        ts_ms: xmlEM.getAttribute('a'),
        ts: xmlEM.getAttribute('a'),
        t: xmlEM.getAttribute('a')
      }
    } else return undefined
  }
}
