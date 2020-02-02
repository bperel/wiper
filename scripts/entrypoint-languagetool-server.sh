#!/bin/bash

basepath=/srv/languagetool-runtime
languagetool_path=${basepath}/`ls ${basepath}`
java -cp ${languagetool_path}/'*' org.languagetool.server.HTTPServer --port 8010 --public --allow-origin '*' --config /home/db.properties