TARGETDIR=test-output/

function assert-equals {
    Current=$1
    Expected=$2
    Script=$3

    if [[ "$Current" == "$Expected" ]]
    then
        echo "[ PASS ] $Script"
    else
        echo ""
        echo "===[ FAIL ]==========================================================================="
        echo ""
        echo " Script:   $Script"
        echo " Expected: $Expected"
        echo " Got:      $Current"
        echo ""
        echo "======================================================================================"
        echo ""
    fi
}

function generate-test {
    Output=$1
    TestFile=$2

    echo "Generating a $TestFile for the expected result..."
    echo "$Output" > "$TestFile"
}

cd $TARGETDIR

for suite in `ls .`
do
    if [[ -d $suite ]]
    then

        echo ""
        echo "*** Entering suite $suite ***"

        cd $suite

        for script in *.moon
        do
            Output=`moon run $script`

            if [[ -f "$script.expected" ]]
            then
                Expected=`cat $script.expected`

                assert-equals "$Output" "$Expected" "$script"
            else
                generate-test "$Output" "$script.expected"
            fi

        done

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
