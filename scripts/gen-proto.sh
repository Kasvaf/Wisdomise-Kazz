#!/bin/bash

git submodule update --init --recursive

INPUT=wiserpc/proto/
OUTPUT=src/services/grpc/proto
rm -rf $OUTPUT
mkdir -p $OUTPUT
protoc \
  -I=$INPUT \
  --plugin=./node_modules/.bin/protoc-gen-ts_proto \
  --ts_proto_opt=outputClientImpl=grpc-web,useSnakeTypeName=false,comments=false,lowerCaseServiceMethods=true \
  --ts_proto_out=$OUTPUT \
  $INPUT/*.proto
