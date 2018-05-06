#!/bin/bash
nohup ./connect.sh $1 &
./start-ffmpeg.sh filename.mp4


