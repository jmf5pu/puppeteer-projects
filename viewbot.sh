printf "spinning up ${1:-1} process(es)..."

for ((j = 0; j < ${1:-1}; j++))
do
    i=$((++i%4 + 2)); 
    printf "\r"   
    printf '\b|/-\' | cut -b 1,$i | tr -d '\n'; 
    printf " spinning up ${1:-1} process(es)..."
    tsc viewer.ts | node viewer.js ${2:-120} ${3:-240} ${4:-y} ${5:-y} &
    pids[${j}]=$!
done

(   
    while sleep 1; do    
        i=$((++i%4 + 2)); 
        printf "\r"   
        printf '\b|/-\' | cut -b 1,$i | tr -d '\n'; 
        printf " waiting for each process in ${pids[*]} to exit..."
    done
) &
waiting_pid=$!

for pid in ${pids[*]}; 
do
    wait $pid
done

kill $waiting_pid

printf "\33[2K\rall processes have completed!"
