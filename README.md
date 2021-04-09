# proton-cli

This repository was forked from https://github.com/ProtonProtocol/proton-examples and contains commands to be used conveniently by command line.

For more information, check these APIs:
- [AtomicAssets API](https://proton.api.atomicassets.io/atomicassets/docs/swagger/)
- [AtomicMarket API](https://proton.api.atomicassets.io/atomicmarket/docs/swagger/)

Copy `.env.example` to `.env` and set your account's `PRIVATE_KEY` and your default `ACCOUNT` (proton username). All other variables are optional. To test on testnet, set `CHAIN=test`.

# Command line examples

Generally you run a command like this:
```
node filename.js
```

Example:
```
node sales.js
```

On Linux you can run them e.g. like this:
```
./sales.js
```

To see the usage and options of a command, add `--help`, e.g.:
```
node sales.js --help

# or:

./sales.js --help
```

# Available commands

- balances.js
- buy-ram.js
- creator-balances.js
- delist.js
- nfts.js
- relist.js
- sales.js
- sell.js
- send-nft.js
- templates.js

**Disclaimer**: under heavy development. Use at your own risk. Please submit bugs and even better submit PRs with the fix ;)