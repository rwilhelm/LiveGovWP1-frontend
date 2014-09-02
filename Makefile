BASEDIR = .

IGNOREFILE = $(BASEDIR)/.gitignore
REMOVEFILES = `cat $(IGNOREFILE)` *bz2

NAME = lg-inspect
TARBALL = $(NAME)-`date '+%Y%m%d'`.tar.bz2



REMOTE_HOST = rene@141.26.69.238



install: npm bower

bower:
	@echo installing bower components
	@bower install

npm:
	@echo installing node modules
	@npm install ${ENVIRONMENT}

clean:
	@rm -rf $(REMOVEFILES)

tarball:
	@tar cjpf $(TARBALL) --exclude-from=$(IGNOREFILE) --exclude=$(TARBALL) $(BASEDIR)

deploy:
	@echo deploying to $(REMOTE_HOST)
	@rsync -av $(BASEDIR) $(REMOTE_HOST):$(NAME) --exclude-from=$(IGNOREFILE)

deploy-production:
	@echo deploying to $(REMOTE_HOST)
	@rsync -av $(BASEDIR) $(REMOTE_HOST):$(NAME)-production --exclude-from=$(IGNOREFILE)
