for FILENAME in *; do
perl -i -n -p -e 's![\cM]!!igs' $FILENAME
done