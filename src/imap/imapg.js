var Imap = require('node-imap'),
    inspect = require('util').inspect;


    const { ImapFlow } = require('imapflow');
    const msgpack = require('msgpack5')();

    const _Invokeimap = (req,res) => {



    }



    const TestMail = (req,res) => {


     // options = options || {};
        let page =  req.params.page;
        let pageSize = 10;




      const client = new ImapFlow({
        host: 'imap.gmail.com',
        port: 993,
        secure: true,
        auth: {
            user: 'hari95nn@gmail.com',
            pass: 'hfpfqsrraecdravl'
        }
    });




    const main = async () => {
      // Wait until client connects and authorizes
      await client.connect();



    function getMailboxStatus() {
      let mailboxInfo = client.mailbox;

      let status = {
          path: this.path
      };

      status.highestModseq = mailboxInfo.highestModseq ? mailboxInfo.highestModseq : false;
      status.uidValidity = mailboxInfo.uidValidity ? mailboxInfo.uidValidity : false;
      status.uidNext = mailboxInfo.uidNext ? mailboxInfo.uidNext : false;
      status.messages = mailboxInfo.exists ? mailboxInfo.exists : 0;

      return status;
  }


  function getAttachmentList(packedUid, bodyStructure) {
    let attachments = [];
    let textParts = [[], [], []];
    if (!bodyStructure) {
        return attachments;
    }


 let uidBuf = Buffer.alloc(4 + 4);
 uidBuf.writeUInt32BE('INBOX', 0);
 uidBuf.writeUInt32BE(packedUid, 4);

 let res = uidBuf.toString('base64url');
 let idBuf = Buffer.from(res, 'base64url');
 let encodedTextSize = {};


   // let idBuf = Buffer.from(packedUid, 'base64url');


    let walk = (node, isRelated) => {
        if (node.type === 'multipart/related') {
            isRelated = true;
        }

        if (!/^multipart\//.test(node.type)) {
            if (node.disposition === 'attachment' || !/^text\/(plain|html)/.test(node.type)) {
                attachments.push({
                    // append body part nr to message id
                    id: Buffer.concat([idBuf, Buffer.from(node.part || '1')]).toString('base64url'),
                    contentType: node.type,
                    encodedSize: node.size,
                    filename: (node.dispositionParameters && node.dispositionParameters.filename) || (node.parameters && node.parameters.name) || false,
                    embedded: isRelated,
                    inline: node.disposition === 'inline' || (!node.disposition && isRelated),
                    contentId: node.id
                });
            } else if ((!node.disposition || node.disposition === 'inline') && /^text\/(plain|html)/.test(node.type)) {
                let type = node.type.substr(5);
                if (!encodedTextSize[type]) {
                    encodedTextSize[type] = 0;
                }
                encodedTextSize[type] += node.size;
                switch (type) {
                    case 'plain':
                        textParts[0].push(node.part || '1');
                        break;
                    case 'html':
                        textParts[1].push(node.part || '1');
                        break;
                    default:
                        textParts[2].push(node.part || '1');
                        break;
                }
            }
        }

        if (node.childNodes) {
            node.childNodes.forEach(childNode => walk(childNode, isRelated));
        }
    };

    walk(bodyStructure, false);

    return {
        attachments,
        textId: Buffer.concat([idBuf, msgpack.encode(textParts)]).toString('base64url'),
        encodedTextSize
    };
}


  const   getMessageInfo = async(messageData) => {
    if (!messageData) {
        return false;
    }

   // console.log(messageData.bodyStructure.childNodes);
 //  let {meta, content} = await client.download(messageData.uid);
  // content.pipe(fs.createWriteStream(meta.filename));
 // console.log(content);

  //   let { attachments, textId, encodedTextSize } = getAttachmentList(messageData.uid, messageData.bodyStructure);





  let envelope = messageData.envelope || {};

    let date =
        envelope.date && typeof envelope.date.toISOString === 'function' && envelope.date.toString() !== 'Invalid Date'
            ? envelope.date
            : messageData.internalDate;

    let isDraft = false;
    if (messageData.flags && messageData.flags.has('\\Draft')) {
        isDraft = true;
    }

    // // do not expose the \Recent flag as it is session specific
    if (messageData.flags && messageData.flags.has('\\Recent')) {
        messageData.flags.delete('\\Recent');
    }

    if (messageData.labels && messageData.labels.has('\\Draft')) {
        isDraft = true;
    }


    let result = {
      //  id: packedUid,
        uid: messageData.uid,

      //  path: (extended && this.path && normalizePath(this.path)) || undefined,

        emailId: messageData.emailId || undefined,
        threadId: messageData.threadId || undefined,

        date: (date && typeof date.toISOString === 'function' && date.toISOString()) || undefined,

        flags: messageData.flags ? Array.from(messageData.flags) : undefined,
        labels: messageData.labels ? Array.from(messageData.labels) : undefined,

        unseen: messageData.flags && !messageData.flags.has('\\Seen') ? true : undefined,
        flagged: messageData.flags && messageData.flags.has('\\Flagged') ? true : undefined,
        answered: messageData.flags && messageData.flags.has('\\Answered') ? true : undefined,

        draft: isDraft ? true : undefined,

        size: messageData.size || undefined,
        subject: envelope.subject || undefined,
        from: envelope.from && envelope.from[0] ? envelope.from[0] : undefined,

        replyTo: envelope.replyTo && envelope.replyTo.length ? envelope.replyTo : undefined,
        sender:  envelope.sender && envelope.sender[0] ? envelope.sender[0] : undefined,

        to: envelope.to && envelope.to.length ? envelope.to : undefined,
        cc: envelope.cc && envelope.cc.length ? envelope.cc : undefined,

        bcc: envelope.bcc && envelope.bcc.length ? envelope.bcc : undefined,

     //   attachments: attachments && attachments.length ? attachments : undefined,
        messageId: (envelope.messageId && envelope.messageId.toString().trim()) || undefined,
        inReplyTo: envelope.inReplyTo || undefined,

       // headers: (extended && messageData.headers && libmime.decodeHeaders(messageData.headers.toString().trim())) || undefined,
        // text: textId
        //     ? {
        //           id: textId,
        //           encodedSize: encodedTextSize
        //       }
        //     : undefined
    };

    Object.keys(result).forEach(key => {
        if (typeof result[key] === 'undefined') {
            delete result[key];
        }
    });



     return result;
}

  let options =   {};



      // Select and lock a mailbox. Throws if mailbox does not exist
      let lock = await client.getMailboxLock('INBOX');
      try {
        let mailboxStatus = getMailboxStatus();
        let messageCount = mailboxStatus.messages;

        let uidList;
        let opts = {};

        uidList = await client.search(options.search, { uid: true });
        uidList = !uidList ? [] : uidList.sort((a, b) => b - a); // newer first
        messageCount = uidList.length;

        let pages = Math.ceil(messageCount / pageSize) || 1;

        if (page < 0) {
            page = 0;
        }

        if (page >= pages) {
            page = pages - 1;
        }

        let messages = [];
        let seqMax, seqMin, range;

        if (!messageCount) {
            return {
                page,
                pages,
                messages
            };
        }




        if (options.search && uidList) {
          let start = page * pageSize;
          let uidRange = uidList.slice(start, start + pageSize).reverse();
          range = uidRange.join(',');
          opts.uid = true;
      } else {
          seqMax = messageCount - page * pageSize;
          seqMin = seqMax - pageSize + 1;

          if (seqMax >= messageCount) {
              seqMax = '*';
          }

          if (seqMin < 1) {
              seqMin = 1;
          }

          range = seqMin === seqMax ? `${seqMin}` : `${seqMin}:${seqMax}`;
      }


      let fields = {
        uid: true,
        flags: true,
        size: true,
        bodyStructure: true,
        envelope: true,
        internalDate: true,
        emailId: true,
        threadId: true,
        labels: true,
      //  bodyParts : ['TEXT']
     //   bodies: [ 'HEADER.FIELDS (FROM TO SUBJECT)', '1.TEXT'],
      //  bodies: ['HEADER', 'TEXT'],

    };


    for await (let messageData of client.fetch(range, fields, opts)) {
      if (!messageData || !messageData.uid) {
          //TODO: support partial responses
          this.logger.debug({ msg: 'Partial FETCH response', code: 'partial_fetch', query: { range, fields, opts } });
          continue;
      }


      let messageInfo =  await getMessageInfo(messageData);
      messages.push(messageInfo);
  }

  // return {
  //     total: messageCount,
  //     page,
  //     pages,
  //     // list newer first
  //     messages: messages.reverse()
  // };

  return res.status(200).json({
    total: messageCount,
    page,
    pages,
    // list newer first
    messages: messages.reverse()
})




// console.log(messageCount);
//           // fetch latest message source
//           // client.mailbox includes information about currently selected mailbox
//           // "exists" value is also the largest sequence number available in the mailbox
//           let message = await client.fetchOne(client.mailbox.exists, { source: true });
//         //  console.log(message.source.toString());

//           // list subjects for all messages
//           // uid value is always included in FETCH response, envelope strings are in unicode.
//           var mee = []
//           for await (let message of client.fetch('* : 3', { envelope: true })) {
//               //console.log(`${message.uid}: ${message.envelope.subject}`);
//               mee.push(message.envelope.subject)
//              // res.send()
//           }
//          // res.send(mee)
//           return res.status(200).json(mee)
      } finally {
          // Make sure lock is released, otherwise next `getMailboxLock()` never returns
          lock.release();
      }

      // log out and close connection
      await client.logout();
  };

  main().catch(err => console.error(err));



    }


    const getmess = async (req,res) => {
    //  var searchCriteria = [['HEADER','IN-REPLY-TO',messageId]];


      const client = new ImapFlow({
        host: 'imap.gmail.com',
        port: 993,
        secure: true,
        auth: {
            user: 'hari95nn@gmail.com',
            pass: 'hfpfqsrraecdravl'
        }
    });

    let fields =  {
      uid: true,
      flags: true,
      size: true,
    //  bodyStructure: true,
      envelope: true,
      internalDate: true,
      headers:  true,
      emailId: true,
      threadId: true,
      labels: true
  };
  var searchCriteria = [['HEADER','IN-REPLY-TO',req.params.uid]];

  let messageData = await client.fetchOne({uid : req.params.uid}, { uid: true });
  console.log(messageData);
      return res.status(200).json(messageData)


    }



module.exports = {
  Imap : _Invokeimap,
  TestMail : TestMail,
  getmess : getmess


}
