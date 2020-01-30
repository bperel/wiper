# wiper

Target flow:

![alt text](sequence%20diagram.png "Target flow")

Populate DB with :
```bash
java -cp "./languagetool-wikipedia/target/LanguageTool-wikipedia-4.9-SNAPSHOT/LanguageTool-wikipedia-4.9-SNAPSHOT/languagetool-wikipedia.jar:/home/bruno/.m2/repository/org/mariadb/jdbc/mariadb-java-client/2.5.1/mariadb-java-client-2.5.1.jar" org.languagetool.dev.dumpcheck.SentenceSourceChecker --languagemodel nwords-fr/ -f ~/Documents/frwiki-20200101-pages-articles-multistream1.xml -l fr -d db.properties
```

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your unit tests
```
npm run test:unit
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).
