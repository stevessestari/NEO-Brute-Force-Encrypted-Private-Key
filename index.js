
const { Worker } = require('worker_threads')
const { default: Neon, api, wallet, tx, rpc } = require("@cityofzion/neon-js");

//Insert your words list here
const passwordChars = ["12345678", "b34", "87654321a", "d4343", "e434", "f434", "g434", "h434"];
const workerThreads = [];

const encryptedPrivateKey = process.argv[2];
index = -1;




const main = async() =>{

	for(var i = 0; i < 10; i++)
	{
		const worker = new Worker('./worker.js', { workerData:{encryptedPrivateKey} });
		worker.on('message', message => processMessage(worker, message));
		worker.on('error', error => {});
		worker.on('exit', code => {});
		workerThreads.push(worker);
	}
	
}


const processMessage = (worker, message) =>{
	if (message.op == "nextPassword")
	{

		if (index + 1 < passwordChars.length)
		{
			index = index + 1;
		}
		else
		{
			index = 0;

		}
		var currentPasswordStr = passwordChars[index];
		worker.postMessage({
			op:"nextPassword",
			password: currentPasswordStr
		});
	
		console.log("Trying password - " + currentPasswordStr);
	}

	if (message.op == "foundPassword")
	{
		console.log("Password found - " + message.password);
		process.exit(0);
	}

}

main();