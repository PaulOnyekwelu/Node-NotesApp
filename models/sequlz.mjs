import fs from 'fs/promises';
import jsyaml from 'js-yaml';
import { default as Sequelize } from 'sequelize';

let sequlz;

export async function connectDB () {

    if(typeof sequlz === 'undefined'){
        const yamltext = await fs.readFile(process.env.SEQUELIZE_CONNECT, 'utf-8');
        const params = jsyaml.safeLoad(yamltext, 'utf-8'); // parses the json file to object
        // return params;
        
        if(typeof process.env.SEQUELIZE_DBNAME !== 'undefined' && process.env.SEQUELIZE_DBNAME !== ''){
            params.dbname = process.env.SEQUELIZE_DBNAME
        }
        if(typeof process.env.SEQUELIZE_DBUSER !== 'undefined'  && process.env.SEQUELIZE_DBUSER !== ''){
            params.username = process.env.SEQUELIZE_DBUSER;
        }
        if(typeof process.env.SEQUELIZE_DBPASSWORD !== 'undefined' && process.env.SEQUELIZE_DBPASSWORD !== ''){
            params.password = process.env.SEQUELIZE_DBPASSWORD;
        }
        if(typeof process.env.SEQUELIZE_DBHOST !== 'undefined' && process.env.SEQUELIZE_DBHOST !== ''){
            params.params.host = process.env.SEQUELIZE_DBHOST;
        }
        if(typeof process.env.SEQUELIZE_DBPORT !== 'undefined' && process.env.SEQUELIZE_DBPORT !== ''){
            params.params.port = process.env.SEQUELIZE_DBPORT;
        }
        if(typeof process.env.SEQUELIZE_DBDIALECT !== 'undefined' && process.env.SEQUELIZE_DBDIALECT !== ''){
            params.params.Dialect = process.env.SEQUELIZE_DBDIALECT;
        }

        sequlz = new Sequelize(params.dbname, params.username, params.password, params.params);
        sequlz.authenticate()
    }

    return sequlz;
}

export async function close() {
    if(sequlz) sequlz.close();
    sequlz = undefined;
}
