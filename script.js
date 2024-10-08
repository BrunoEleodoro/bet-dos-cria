let web3auth = null;

(async function init() {
  $(".btn-logged-in").hide();
  $("#sign-tx").hide();

  // IMP START - Dashboard Registration
  const clientId = "BAQUy189FCPHHpbacNTTtHUGBQbxZObM9Y0snE_ucesnJ0VPmWVxs_5SUf6Pp2y1b_wkPU1ot90vGmdq-qzB_qk"; // get your clientId from https://dashboard.web3auth.io
  // IMP END - Dashboard Registration

  // IMP START - Chain Config
  const chainConfig = {
    chainNamespace: "eip155",
    chainId: "0xaa36a7",
    rpcTarget: "https://rpc.ankr.com/eth_sepolia",
    // Avoid using public rpcTarget in production.
    // Use services like Infura, Quicknode etc
    displayName: "Ethereum Sepolia Testnet",
    blockExplorerUrl: "https://sepolia.etherscan.io",
    ticker: "ETH",
    tickerName: "Ethereum",
    logo: "https://cryptologos.cc/logos/ethereum-eth-logo.png",
  };
  // IMP END - Chain Config

  // IMP START - SDK Initialization
  const privateKeyProvider = new window.EthereumProvider.EthereumPrivateKeyProvider({ config: { chainConfig } });

  web3auth = new window.NoModal.Web3AuthNoModal({
    clientId,
    privateKeyProvider,
    // web3AuthNetwork: "sapphire_mainnet",
    web3AuthNetwork: "sapphire_devnet",
  });

  const openloginAdapter = new window.OpenloginAdapter.OpenloginAdapter();
  web3auth.configureAdapter(openloginAdapter);

  await web3auth.init();
  // IMP END - SDK Initialization

  if (web3auth.connected) {
    $(".btn-logged-in").show();
    $(".btn-logged-out").hide();
  } else {
    $(".btn-logged-out").show();
    $(".btn-logged-in").hide();
  }
})();

$("#login").click(async function (event) {
  try {
    // IMP START - Login
    await web3auth.connectTo("openlogin", {
      loginProvider: "google",
    }); // IMP END - Login
    $(".btn-logged-out").hide();
    $(".btn-logged-in").show();
    uiConsole("Logged in Successfully!");
  } catch (error) {
    console.error(error.message);
  }
});

$("#get-user-info").click(async function (event) {
  try {
    // IMP START - Get User Information
    const user = await web3auth.getUserInfo();
    // IMP END - Get User Information
    uiConsole(user);
  } catch (error) {
    console.error(error.message);
  }
});

// IMP START - Blockchain Calls
$("#get-accounts").click(async function (event) {
  try {
    const web3 = new Web3(web3auth.provider);

    // Get user's Ethereum public address
    const address = await web3.eth.getAccounts();
    uiConsole(address);
  } catch (error) {
    console.error(error.message);
  }
});

$("#get-balance").click(async function (event) {
  try {
    const web3 = new Web3(web3auth.provider);

    // Get user's Ethereum public address
    const address = (await web3.eth.getAccounts())[0];

    // Get user's balance in ether
    const balance = web3.utils.fromWei(
      await web3.eth.getBalance(address), // Balance is in wei
      "ether"
    );
    uiConsole(balance);
  } catch (error) {
    console.error(error.message);
  }
});

$("#sign-message").click(async function (event) {
  try {
    const web3 = new Web3(web3auth.provider);
    // Get user's Ethereum public address
    const fromAddress = (await web3.eth.getAccounts())[0];

    const originalMessage = "YOUR_MESSAGE";

    // Sign the message
    const signedMessage = await web3.eth.personal.sign(
      originalMessage,
      fromAddress,
      "test password!" // configure your own password here.
    );
    uiConsole(signedMessage);
  } catch (error) {
    console.error(error.message);
  }
});
// IMP END - Blockchain Calls

$("#logout").click(async function (event) {
  try {
    // IMP START - Logout
    await web3auth.logout();
    // IMP END - Logout
    $(".btn-logged-in").hide();
    $(".btn-logged-out").show();
  } catch (error) {
    console.error(error.message);
  }
});

function uiConsole(...args) {
  const el = document.querySelector("#console>p");
  if (el) {
    el.innerHTML = JSON.stringify(args || {}, null, 2);
    console.log(...args);
  }
}