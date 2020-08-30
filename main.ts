import { createReadStream, writeFile} from 'fs';
import readLine from "readline";


const stream = createReadStream("./suras.txt",{
    flags: "r",
    // encoding: "utf8",
});

const regex = /([0-9]+)\.(.+)\n/g
const suraRegex  = /Сура.*\n(.+\n)/;
const results: {[title: string]: string} = {};

let currentSurra;
let current = "";
let prev = "";


function processLineByLine() {
    const fileStream = createReadStream('./suras.txt');

    const rl = readLine.createInterface({
        input: fileStream,
        crlfDelay: Infinity,        
    });

    rl.on('line', function (line) {
        prev = current;
        current = line;

       
        const titleMatch = suraRegex.exec(prev+"\n"+current+"\n");
        
        if(titleMatch && titleMatch[1]) {
            currentSurra = titleMatch[1]
                .replace("\t", "")
                .replace(/[0-9]+\./, "")
                .replace("\n", "");
            console.log(currentSurra);    
        }
        
        const match = regex.exec(line+"\n");

        if(match && match[1] && match[2]) {
            const suraText = match[2]
                    .replace("\t", "")
                    .replace(/[0-9]+\./, "")
                    .replace("\n", "")

            const suraKey = currentSurra+" - Аят "+match[1];
            results[suraKey] = suraText;
        }

    });

    fileStream.on("close", () => 


        writeFile(
            "./ayats_db.json", 
            JSON.stringify(results), 
            { flag: 'w' }, 
            (err) => console.log(err)
        )  
    );
}



processLineByLine();






