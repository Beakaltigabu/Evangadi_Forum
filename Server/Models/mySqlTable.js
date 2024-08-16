const userTable = `CREATE TABLE user(
    userid INT(20) NOT NULL AUTO_INCREMENT,
    username VARCHAR(20) NOT NULL,
    firstname VARCHAR(20) NOT NULL,
    lastname VARCHAR(20) NOT NULL,
    email VARCHAR(40) NOT NULL,
    password VARCHAR(100) NOT NULL,
    PRIMARY KEY(userid)
);`;

const questionTable = `CREATE TABLE questions(
    id INT(20) NOT NULL AUTO_INCREMENT,
    questionid VARCHAR(100) NOT NULL UNIQUE,
    userid INT(20) NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    tag VARCHAR(50),
    PRIMARY KEY(id, questionid),
    FOREIGN KEY(userid) REFERENCES user(userid)
)`;

const answerTable = `CREATE TABLE answers(
    answerid INT(20) NOT NULL AUTO_INCREMENT,
    userid INT(20) NOT NULL,
    questionid VARCHAR(100) NOT NULL,
    answer TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(answerid),
    FOREIGN KEY(questionid) REFERENCES questions(questionid),
    FOREIGN KEY(userid) REFERENCES user(userid)
);`;

module.exports = { userTable, questionTable, answerTable };
