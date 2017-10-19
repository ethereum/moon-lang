TARGETDIR=test-output/

cd $TARGETDIR

for suite in `ls .`
do
    if [[ -d $suite ]]
    then

        echo ""
        echo "*** Entering suite $suite ***"

        cd $suite

        rm -Rfv *.moon.expected

        cd ..
    else
        echo ""
        echo "-------------------------------------------------------------------------------------"
        echo " Warning: Please, remove the file $suite from here."
        echo "          It's not a directory test suite..."
        echo "-------------------------------------------------------------------------------------"
        echo ""
    fi
done

cd ..

# END
