echo "spinning up ${1:-1} process(es)..."

for ((i = 0; i < ${1:-1}; i++))
do
    tsc viewer.ts | node viewer.js ${2:-120} ${3:-240} ${4:-y} ${5:-y} &
    pids[${i}]=$!
done

echo "wait for each process in ${pids[*]} to exit..."

for pid in ${pids[*]}; 
do
    wait $pid
done

echo "all processes have completed!"
