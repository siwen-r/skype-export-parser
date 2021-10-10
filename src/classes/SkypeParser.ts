import { Conversation, LegacyQuote, Message } from "@/types/SkypeExport";
import EmojiListSkype from "../assets/skype-smilies.json"
import EmojiListSkypeBetter from "../assets/skype-emojipedia.json"

export class SkypeParser {

  private getXMLRoot(content: string): HTMLElement {
    const parser = new DOMParser();
    const doc = parser.parseFromString( `<xml>${content}</xml>`, "application/xml");

    return doc.documentElement;
  }

  public parseConversation(conversation: Conversation, fileList: FileList) {
    conversation.MessageList = this.parseMessages(conversation.MessageList, fileList);

    return conversation;
  }

  public parseMessages(messages: Message[], fileList: FileList) {
    return messages.map(element => this.parseMessage(element, fileList));
  }

  public parseMessage(message: Message, fileList: FileList) {
    try {
      if (message.messagetype == 'Event/Call') { message.partlist = this.parseCallContent(message.content); }
      if (message.messagetype == 'Text' || message.messagetype == 'RichText') {
        message.quote = this.parseQuoteContent(message.content);
        message.em = this.parseEM(message.content);

        message.content = message.content.replaceAll(/\r\n|\n|\r]/g, '') // FIX replaces all line breaks even those inside the actual message
        message.content = message.content.replace(/<quote (.*)<\/quote>/g, '')
        message.content = message.content.replace(/<e_m(.*)<\/e_m>/g, '')
        message.content = message.content.trim()

        message.content = this.parseSkypeEmoji(message.content);
        message.parsed = true;
      }
      if (message.messagetype == 'RichText/UriObject') {
        message.images = [];
        for (let reference of message.amsreferences) { message.images.push(fileList.find(element => element.name.startsWith(reference)) ) }
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

  private parseSkypeEmoji(xml: string) {
    const xmlRoot = this.getXMLRoot(xml);
    let retval = xml;

    for (var j = 0; j < xmlRoot.getElementsByTagName('ss').length; j++) {
      // TODO move them to a local system (first has with transparent background but no shortcut annotation and two has no transparent background but shrotcut annotation)
      let emoji = EmojiListSkypeBetter.find(element => element.shortcut == xmlRoot.getElementsByTagName('ss')[j].textContent);
      if(!emoji) emoji = EmojiListSkype.find(element => element.shortcut == xmlRoot.getElementsByTagName('ss')[j].textContent);

      if (emoji) retval = retval.replaceAll(`<ss type="${xmlRoot.getElementsByTagName('ss')[j].getAttribute('type')}">${xmlRoot.getElementsByTagName('ss')[j].textContent}</ss>`, `<img class="inline" src="${emoji.image}" alt="${emoji.name}" height="25px" width="25px" loading="lazy">`)
    }

    return retval;
  }
}
