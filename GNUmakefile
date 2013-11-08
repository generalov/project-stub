.DEFAULT_GOAL :=

PROJECT_NAME ?= www
BUILD_ROOT ?= build
DISTDIR ?= $(BUILD_ROOT)/$(PROJECT_NAME)
DIST := $(DISTDIR).tar

NODE_MODULES := ./node_modules/

ENB := $(NODE_MODULES).bin/enb
NPM := npm

BOWER := $(NODE_MODULES).bin/bower --allow-root
BOWER_COMPONENTS := $(CURDIR)/libs/bower_components
BUNDLE := $(CURDIR)/*.bundles
PRODENV := YENV=production XJST_ENGINE=sort-group
STATIC_ROOT := static
FREEZE_PATH := $(STATIC_ROOT)/i


ifneq (,$(findstring B,$(MAKEFLAGS)))
	ENB_FLAGS := --no-cache
endif

all:: $(ENB) server

%:: $(ENB)
	$(if $(findstring GNUmakefile,$@),,$(ENB) make $@ $(ENB_FLAGS))

.PHONY: server
server:: $(ENB) libraries.get
	echo "Open http://127.0.0.1:8080/desktop.bundles/index/index.html to see build results."
	@$(ENB) server

$(ENB):: $(NODE_MODULES) $(BOWER_COMPONENTS)

$(NODE_MODULES)::
	$(debug ---> Updating npm dependencies)
	@$(NPM) install

$(BOWER_COMPONENTS)::
	$(debug ---> Updating bower dependencies)
	@$(BOWER) install

.PHONY: clean
clean::
	$(ENB) make clean
	rm -rf $(BUILD_ROOT)
	rm -rf $(FREEZE_PATH)
	ln -snf development configs/current


.PHONY: pmake dist-html dist-static

pmake: $(ENB)
	$(PRODENV) $(ENB) make --no-cache

dist-html:: pmake
	find $(BUNDLE) -name '_*.html' -o -name '_*.??.html' | while read line; do \
		relpath=`echo $$line | sed 's#^$(CURDIR)##'`; \
		bundle=`dirname $$relpath`; \
		lang=`basename $$relpath | sed -n 's#^.*\(\...\)\.html#\1#p'`; \
		outfile=$(DISTDIR)/index$${lang}.html ; \
		mkdir -p `dirname $$outfile` ; \
		cat $$line | tee $$outfile > /dev/null; \
	done

dist-static:: pmake $(DISTDIR) dist-html
	( echo $(STATIC_ROOT); echo favicon.ico; ) \
		| tar -cT - | tar -C $(DISTDIR) -xvf-

$(DISTDIR)::
	mkdir -p $(DISTDIR)

.PHONY: dist

$(DIST): dist-static
	tar -C $(BUILD_ROOT) -cf $(DIST) $(PROJECT_NAME)

dist:: $(DIST)
