# PostgREST ships as a distroless image without a shell, which makes a Compose
# healthcheck impossible. The release binary is statically linked, so copy it
# into Alpine to keep busybox tools (wget) available for probing the API.
FROM alpine:3.20
RUN adduser -D -u 1001 postgrest
COPY --from=postgrest/postgrest:v12.2.3 /bin/postgrest /bin/postgrest
USER postgrest
ENTRYPOINT ["/bin/postgrest"]
