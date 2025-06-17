FROM postgres:17.5

COPY init.sql /docker-entrypoint-initdb.d/

ENV POSTGRES_DB=streams-db
ENV POSTGRES_USER=postgress
ENV POSTGRES_PASSWORD=mypassword123!
