// const crypto = require("crypto");
// SHA256 = (message) => crypto.createHash("sha256").update(message).digest("hex");
// const EC = require("elliptic").ec,
//   ec = new EC("secp256k1");

// const MINT_KEY_PAIR = ec.genKeyPair();
// const MINT_PUBLIC_ADDRESS = MINT_KEY_PAIR.getPublic("hex");

// const holderKeyPair = ec.genKeyPair();

// const keyPair = ec.genKeyPair();
// // public key: keyPair.getPublic("hex")
// // private key: keyPair.getPrivate("hex")

// class Block {
//   constructor(timestamp = "", data = []) {
//     this.timestamp = timestamp;
//     this.data = data;
//     this.hash = this.getHash();
//     this.prevHash = "";
//     this.nonce = 0;
//   }

//   // Our hash function.
//   getHash() {
//     return SHA256(
//       this.prevHash + this.timestamp + JSON.stringify(this.data) + this.nonce
//     );
//   }

//   mine(difficulty) {
//     // Nó sẽ lặp cho đến khi hash của block có số số 0 bằng difficulty.
//     while (!this.hash.startsWith(Array(difficulty + 1).join("0"))) {
//       // Tăng nonce
//       this.nonce++;
//       // Cập nhật hash mới
//       this.hash = this.getHash();
//     }
//   }

//   hasValidTransactions(chain) {
//     return this.data.every((transaction) =>
//       transaction.isValid(transaction, chain)
//     );
//   }
// }

// class Blockchain {
//   constructor() {
//     // Chúng ta sẽ ra mắt 100000 coin
//     const initalCoinRelease = new Transaction(
//       MINT_PUBLIC_ADDRESS,
//       holderKeyPair.getPublic("hex"),
//       100000
//     );
//     this.chain = [new Block(Date.now().toString(), [initalCoinRelease])];

//     this.difficulty = 1;
//     this.blockTime = 30000;
//     this.transactions = [];
//     this.reward = 297;
//   }

//   addTransaction(transaction) {
//     if (transaction.isValid(transaction, this)) {
//       this.transactions.push(transaction);
//     }
//   }
//   //   Minting
//   // Đây là một khái niệm rất nổi tiếng trong blockchain development, nó có nghĩa là in thêm tiền.
//   // Chain sẽ mint (in tiền ra) để tạo ra tiền thưởng cho bạn.
//   mineTransactions(rewardAddress) {
//     let gas = 0;

//     this.transactions.forEach((transaction) => {
//       gas += transaction.gas;
//     });

//     const rewardTransaction = new Transaction(
//       MINT_PUBLIC_ADDRESS,
//       rewardAddress,
//       this.reward + gas
//     );
//     rewardTransaction.sign(MINT_KEY_PAIR);

//     // Ngăn chặn hành dộng mint coin và mine luôn transaction đó
//     if (this.transactions.length !== 0)
//       this.addBlock(
//         new Block(Date.now().toString(), [
//           rewardTransaction,
//           ...this.transactions,
//         ])
//       );

//     this.transactions = [];
//   }

//   getLastBlock() {
//     return this.chain[this.chain.length - 1];
//   }

//   addBlock(block) {
//     block.prevHash = this.getLastBlock().hash;
//     block.hash = block.getHash();
//     block.mine(this.difficulty);
//     this.chain.push(block);

//     this.difficulty +=
//       Date.now() - parseInt(this.getLastBlock().timestamp) < this.blockTime
//         ? 1
//         : -1;
//   }

//   // Chain sẽ hợp lệ khi hash của block bằng giá trị mà getHash của nó trả về,
//   // cũng như prevHash phải bằng hash của block trước đó.
//   isValid() {
//     // Lặp qua chain, bắt đầu từ 1 vì trước genesis block không có gì.
//     for (let i = 1; i < this.chain.length; i++) {
//       const currentBlock = this.chain[i];
//       const prevBlock = this.chain[i - 1];

//       // Kiểm tra
//       if (
//         currentBlock.hash !== currentBlock.getHash() ||
//         prevBlock.hash !== currentBlock.prevHash ||
//         !currentBlock.hasValidTransactions(blockchain)
//       ) {
//         return false;
//       }
//     }

//     return true;
//   }
//   // Chain sẽ được xác thực khi mọi block chứa các giao dịch đã được xác thực, và nó được xác thực khi:

//   // From, to, amount không bị bỏ trống.
//   // Người gửi có đủ số tiền.
//   // Chữ ký được verify.
//   getBalance(address) {
//     let balance = 0;

//     this.chain.forEach((block) => {
//       block.data.forEach((transaction) => {
//         if (transaction.from === address) {
//           balance -= transaction.amount;
//           balance -= transaction.gas;
//         }

//         if (transaction.to === address) {
//           balance += transaction.amount;
//         }
//       });
//     });

//     return balance;
//   }

//   // proof of work
//   //   Nó yêu cầu quét một giá trị bắt đầu bằng một số số 0 nhất định khi được hash.
//   //   Giá trị được gọi là giá trị nonce, số bit 0 đứng đầu được gọi là difficulty.
//   //   Bằng cách tăng độ khó, việc khai thác ngày càng khó hơn và
//   //   chúng ta có thể ngăn chặn việc sửa đổi các block trước đó
//   //   bởi vì việc làm lại tất cả công việc này nhưng vẫn bắt kịp những block khác là điều không thể.
// }

// class Transaction {
//   constructor(from, to, amount, gas = 0) {
//     this.from = from;
//     this.to = to;
//     this.amount = amount;
//     this.gas = gas;
//   }
//   sign(keyPair) {
//     // Kiểm tra xem public key có giống với địa chỉ gửi không
//     if (keyPair.getPublic("hex") === this.from) {
//       // Kí
//       this.signature = keyPair
//         .sign(SHA256(this.from + this.to + this.amount + this.gas), "base64")
//         .toDER("hex");
//     }
//   }

//   isValid(tx, chain) {
//     return (
//       tx.from &&
//       tx.to &&
//       tx.amount &&
//       // Thêm gas vào
//       (chain.getBalance(tx.from) >= tx.amount + tx.gas ||
//         tx.from === MINT_PUBLIC_ADDRESS) &&
//       ec
//         .keyFromPublic(tx.from, "hex")
//         .verify(SHA256(tx.from + tx.to + tx.amount + tx.gas), tx.signature)
//     );
//   }
// }

// // voi blockchain bitcoin
// // old difficulty * (2016 blocks * 10 phút) / thời gian đào 2016 blocks trước (theo đơn vị của block time)

// // Để phòng chống các giao dịch lỗi, chúng ta sẽ dùng một signing algorithm (thuận toán ký) kèm với một cặp key.
// // Cặp key này sẽ gồm một key bí mật (private key) và một key công khai (public key).
// // Public key có thể được dùng để làm địa chỉ ví và kiểm tra tính xác thực của chữ kí.
// // Private key sẽ được dùng để kí. Vì chỉ bạn có private key, chỉ có bạn có thể kí được giao dịch của mình, đảm bảo được tính bảo mật.
// module.exports = { Block, Blockchain };
