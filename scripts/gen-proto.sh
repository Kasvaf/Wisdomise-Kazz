#!/bin/bash

git submodule update --init --recursive

INPUT=wiserpc/proto/
OUTPUT=src/services/grpc/proto
rm -rf $OUTPUT
mkdir -p $OUTPUT

# Windows-compatible protoc command
npx protoc \
  --proto_path=$INPUT \
  --plugin=protoc-gen-ts_proto="$(pwd)/protoc-gen-ts_proto.bat" \
  --ts_proto_opt=outputClientImpl=grpc-web,useSnakeTypeName=false,comments=false,lowerCaseServiceMethods=true \
  --ts_proto_out=$OUTPUT \
  $INPUT/*.proto
