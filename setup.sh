cd 'pwr-frontend'
npm install

cd ..
cd generate

v=$(python --version 2>&1)
ECHO "xxx "
if [ ${v:7:1} -eq 3 ]
then
  python -m venv env
  source env/bin/activate
  pip install -r requirements.txt
  python -m spacy download en_core_web_lg
else
  python3 -m venv env
  source env/bin/activate
  pip install -r requirements.txt
  python3 -m spacy download en_core_web_lg
fi

cd server

ECHO "You should now be ready to run both the front and back ends."
ECHO "In a new Terminal window, cd into the pwr-frontend folder, and"
ECHO "run:"
ECHO ""
ECHO "\`npm start\`"
ECHO ""
ECHO "...to get the frontend running. Then in this terminal, cd into"
ECHO "the server folder and run:"
ECHO ""
ECHO "\`python api_server.py\` (or \`python3 api_server.py\` if"
ECHO "Python 3 is not your default version: run \`python --version\`"
ECHO "to find out if you don't know)"
