var xhr;
var xhrcount;
var xhrdetail;
var xhroffers = [];
var term = "";
var page = 1;
var end = 0;
var intro = 0;
var categoryid = 0;
var brandid = 0;
var viewmode = 0;
var preload = 1;
var sort = 0;
var minprice = 0;
var maxprice = 0;

$(document).ready(function () {
    $("#searchbox").on('change keydown paste input', function (e) {
        categoryid = 0;
        brandid = 0;
        page = 1;
        startSearching();
        if (e.keyCode == 13) {
            this.blur();
        }
    });

    $(".sort-group").click(function () {
        sort = parseInt($(this).attr('sort'));
        page = 1;
        active = 0;
        categories = [];
        brands = [];
        processSearch();
    });

    $(window).scroll(function () {
        if ($(window).scrollTop() + $(window).height() == $(document).height()) {
            nextPage();
        }
    });

    $("#chkViewMode").change(function () {
        toggleViewMode();
    });

    checkAuthentication();
    
    $('.parallax').parallax();
});

function startApp() {
    var _term = getParameterByName('term');
    var _page = getParameterByName('page');
    var _sort = getParameterByName('sort');
    var _categoryid = getParameterByName('category');
    var _brandid = getParameterByName('brand');
    var _viewmode = getParameterByName('view');
    var hasStart = 0;

    if (_term != null && _term != '' && _term != undefined) {
        hasStart = 1;
        $("#searchbox").val(_term);
        term = _term;
    }

    if (_page != null && _page != 0 && _page != undefined) {
        page = _page;
    }

    if (_sort != null && _sort != 0 && _sort != undefined) {
        $("#sort-" + _sort).attr('checked', 'checked');
        sort = _sort;
    }

    if (_viewmode != null && _viewmode != 0 && _viewmode != undefined) {
        viewmode = _viewmode;
        if (viewmode > 0) {
            $("#chkViewMode").attr('checked', 'checked');
        }
    }

    if (_categoryid != null && _categoryid != 0 && _categoryid != undefined) {
        hasStart = 1;
        categoryid = _categoryid;
    }

    if (_brandid != null && _brandid != 0 && _brandid != undefined) {
        hasStart = 1;
        brandid = _brandid;
    }

    if (hasStart == 1) {
        processSearch();
    }
}

function startIntro() {
    if (intro == 0) {
        intro = 1;
        $("#intro").fadeOut('fast');
        $("#info-beta").fadeOut('fast');
        $("#beta-image").fadeOut('fast');
        $("#header").fadeIn('fast');
        $("#filters").fadeIn('fast');
        $("body").css('background-color', '#eee');
        $("#search-card").removeClass('m6');
        $("#search-card").removeClass('offset-s1');
        $("#search-card").removeClass('s10');
        $("#search-card").removeClass('offset-m3');
        $("#search-card").removeClass('z-depth-4');
        $("#search-card").removeClass('rounded-card');
        $("#search-card").addClass('s12');
        $("#search-sorting").fadeIn('fast');
        $("#footer").fadeOut('fast');
        $("#floating").css('bottom', '2rem');
        $("#search-card").detach().prependTo('#search-box-parent');
        $(".search-container").fadeOut('fast');
        $(window).scrollTop(0);
    }
}

function processSearch() {
    startIntro();

    end = 0;
    categories = [];
    brands = [];
    $('#categorynav').html('');
    $('#brandnav').html('');
    term = $("#searchbox").val();
    if (xhr && xhr.readystate != 4) {
        xhr.abort();
    }
    if (xhrcount && xhrcount.readystate != 4) {
        xhrcount.abort();
    }
    $.each(xhroffers, function (index, value) {
        if (value && value.readystate != 4) {
            value.abort();
        }
    });
    xhroffers = [];

    $('#results').html('<div class="progress"><div class="indeterminate"></div></div>');

    xhrcount = $.ajax({
        url: "/api/count",
        type: "GET",
        data: {
            term: term,
            category: categoryid,
            brand: brandid,
            minprice: minprice,
            maxprice: maxprice
        },
        cache: true,
        success: function (data) {
            var categoryhtml = '';
            var brandhtml = '';

            var dropdowncategoryhtml = '';
            var dropdownbrandhtml = '';

            var totalcategory = 0;
            var totalbrand = 0;
            var _minprice = 0;
            var _maxprice = 0;

            for (var itemindex in JSON.parse(data)) {
                var item = JSON.parse(data)[itemindex];
                if (item.id != null && item.id != 0) {
                    if (item.type == 'category') {
                        var cssclass = '';
                        if (item.id == categoryid) {
                            cssclass = ' class="active"';
                        }
                        categoryhtml += '<li><a' + cssclass + ' id="category_' + item.id + '" href="#" onclick="filterCategory(' + item.id + '); return false">' + item.name + ' (' + item.count + ')</a></li>';
                        totalcategory += parseInt(item.count);
                    } else {
                        var cssclass = '';
                        if (item.id == brandid) {
                            cssclass = ' class="active"';
                        }
                        brandhtml += '<li><a' + cssclass + ' id="brand_' + item.id + '" href="#" onclick="filterBrand(' + item.id + '); return false">' + item.name + ' (' + item.count + ')</a></li>';
                        totalbrand += parseInt(item.count);
                    }
                }

                if ((item.minprice < _minprice && item.minprice > 0) || _minprice == 0) {
                    _minprice = item.minprice;
                }

                if (item.maxprice > _maxprice || _maxprice == 0) {
                    _maxprice = item.maxprice;
                }
            }

            $('#brandnav').html('<li><a href="#" onclick="filterBrand(0); return false">All brands (' + totalbrand + ')</a></li>' + brandhtml);
            $('#categorynav').html('<li><a href="#" onclick="filterCategory(0); return false">All categories (' + totalcategory + ')</a></li>' + categoryhtml);

            xhr = $.ajax({
                url: "/api/search",
                type: "GET",
                data: {
                    term: term,
                    category: categoryid,
                    brand: brandid,
                    sort: sort,
                    minprice: minprice,
                    maxprice: maxprice
                },
                cache: false,
                success: function (data) {
                    if (viewmode == 0) {
                        var viewhtml = '<div class="row red hide-on-med-and-down" style="padding: 1rem; color: #fff; margin-bottom: 0;"><div class="col l10">Product</div><div class="col l2"></div></div>';
                        if (authenticated == 1) {
                            viewhtml = '<div class="row red hide-on-med-and-down" style="padding: 1rem; color: #fff; margin-bottom: 0;">';
                            if (hasPlatforms == 1) {
                                viewhtml += '<div class="col l1 m1 hide-small-screen" style="padding: 0; width: 3rem; height: 1rem;">';
                                viewhtml += '<input type="checkbox" class="filled-in queue-checkbox-all" id="queue-checkbox-all" /><label for="queue-checkbox-all" data-position="right" class="tooltipped" data-delay="50" data-tooltip="Vink aan om te importeren"></label>';
                                viewhtml += '</div>';
                                viewhtml += '<div class="col l6 m6 s11">Product (Vink de producten aan die u wilt importeren)</div>';
                            } else {
                                viewhtml += '<div class="col l7 m8 s11">Product</div>';
                            }
                            viewhtml += '<div class="col l1 m1 hide-small-screen">Voorraad</div>';
                            viewhtml += '<div class="col l2 m2 hide-small-screen">Levertijd</div>';
                            viewhtml += '<div class="col l2 m2 hide-small-screen">Prijs (Excl. BTW)</div>';
                            viewhtml += '</div>';
                        }
                        viewhtml += '<ul id="resultlist" class="collapsible popout" data-collapsible="accordion" style="margin-top: 0;"></ul>';
                        $('#results').html(viewhtml);
                        setCollapsible();
                    } else {
                        $('#results').html('<ul class="row product-list" id="resultlist"></ul>');
                    }
                    parseProducts(data);
                },
                error: function (data) {
                    console.log(data);
                    $('#results').html('<ul class="collection" style="background-color: #fff;"><li class="collection-item">No results</li></ul>');
                }
            });
        },
        error: function (data) {
            console.log(data);
        }
    });
}

function startSearching() {
    if (term != $("#searchbox").val() && $("#searchbox").val().length > 2) {
        page = 1;
        active = 0;
        categories = [];
        brands = [];
        minprice = 0;
        maxprice = 0;

        var slider = document.getElementById('price-slider');
        try {
            slider.noUiSlider.destroy();
        } catch (e) {

        }

        processSearch();
    } else {
        if ($("#searchbox").val().length < 3) {
            $('#results').html('');
            term = $("#searchbox").val();
            $('#categorynav').html('');
            $('#brandnav').html('');
        }
    }
}

function setCategory(id) {
    term = "";
    filterCategory(id);
}

function filterCategory(id) {
    startIntro();
    page = 1;
    $('#category_' + categoryid).removeClass('active');
    categoryid = id;
    processSearch();
}

function filterBrand(id) {
    startIntro();
    page = 1;
    $('#brand_' + brandid).removeClass('active');
    brandid = id;
    $('#brand_' + brandid).addClass('active');
    processSearch();
}

function nextPage() {
    if (end != 1) {
        page++;
        if (xhr && xhr.readystate != 4) {
            xhr.abort();
        }
        xhr = $.ajax({
            url: "/API/Search",
            type: "GET",
            data: {
                term: term,
                page: page,
                category: categoryid,
                brand: brandid
            },
            cache: true,
            success: function (data) {
                parseProducts(data);
            },
            error: function (data) {
                console.log(data);
            }
        });
    }
}

function setCollapsible() {
    $('.collapsible').collapsible({
        onOpen: openCollapsible,
        onClose: closeCollapsible
    });

    $("#queue-checkbox-all").click(function () {
        var c = this.checked;
        $('.queue-checkbox').prop('checked', c);
        $(".queue-checkbox").each(function (index) {
            if ($(this).is(':checked')) {
                addToQueue($(this).attr('product'));
            } else {
                removeFromQueue($(this).attr('product'));
            }
        });
    });
}

function openCollapsible(el) {

}

function closeCollapsible(el) {
    if (xhrdetail && xhrdetail.readystate != 4) {
        xhrdetail.abort();
    }
}

function parseProducts(products) {
    var _url = '?view=' + viewmode;

    if (term != "") {
        _url += '&term=' + term;
    }

    if (categoryid != 0) {
        _url += '&category=' + categoryid;
    }

    if (brandid != 0) {
        _url += '&brand=' + brandid;
    }

    if (sort != 0) {
        _url += '&sort=' + sort;
    }

    if (stealthmode == 1) {
        _url += '&stealthmode=' + stealthmode;
    }

    window.history.pushState("", "", _url);

    if (JSON.parse(products).length == 0) {
        end = 1;
        return false;
    }

    if (authenticated == 1) {
        $.each(JSON.parse(products), function (index, value) {
            parseFirstProduct(value);

            if (value.intOfferCount > 1) {
                var xhroffer = $.ajax({
                    url: "/api/offers",
                    type: "GET",
                    data: {
                        id: value.intProductID
                    },
                    cache: true,
                    success: function (data) {
                        $('#product-loader-' + value.intProductID).hide();
                        parseData(data, value);
                    },
                    error: function (data) {
                        console.log(data);
                    }
                });
                xhroffers.push(xhroffer);
            }
        });
    } else {
        $.each(JSON.parse(products), function (index, value) {
            parseSimple(value);
        });

        setCollapsible();
    }

    if (term != "" && (categoryid > 0 || brandid > 0)) {
        $.each(JSON.parse(products), function (index, value) {
            $.ajax({
                url: "/api/score",
                type: "GET",
                data: {
                    id: value.intProductID
                },
                cache: false,
                success: function (data) {

                },
                error: function (data) {
                    console.log(data);
                }
            });
        });
    }

    if (page < preload) {
        nextPage();
    }
}

function parseSimple(data) {
    if (viewmode == 0) {
        //Item
        var html = '<li class="product-item" product="' + data.intProductID + '" offer="0" stock="0" brand="' + data.intProductBrandID + '" category="' + data.intProductCategoryID + '">';

        //Header
        html += '<div class="collapsible-header">';
        html += '<div class="row" style="margin-bottom: 0px;">';
        html += '<div class="col l10 m10 s10">' + data.strTitle + '</div>';
        html += '<div class="col l2 m2 s2"><i class="material-icons right">more_horizontal</i></div>';
        html += '</div>';
        html += '</div>';

        //Content
        html += '<div class="collapsible-body" style="position: relative; padding-bottom: 4rem;">';

        //Row
        html += '<div class="row">';

        if (authenticated == 0) {
            html += '<div class="row center-align"><img src="' + data.strImageURL + '" style="max-width: 90%; max-height: 200px;" /></div>';
            html += '<div class="row center-align"><a href="/app/login">Meld u aan</a> voor product informatie en actuele prijzen.</div>';
        } else {
            //Left
            html += '<div id="gallery_' + data.intProductOfferID + '" class="col s12 l4 l4">';
            html += '<p style="text-align: center;">';
            html += '<img src="' + data.strImageURL + '" style="max-width: 90%; max-height: 320px;" />';
            html += '</p>';
            html += '</div>';

            //Right
            html += '<div class="col s12 m8 l8">';
            html += '<p class="light" id="detail_' + data.intProductOfferID + '">';

            html += '</p>';
            html += '</div>';
        }

        //End Row
        html += '</div>';

        //End Content
        html += '</div>';

        //End Item
        html += '</li>';
        $('#resultlist').append(html);
    } else if (viewmode == 1) {
        var html = '<li class="col l2 m6 s12" brand="' + data.intProductBrandID + '" category="' + data.intProductCategoryID + '">';

        html += '<div class="card">';

        html += '<div class="card-image">';
        if (data.strImageURL != "") {
            html += '<img src="' + data.strImageURL + '" alt="' + data.strTitle + '">';
        } else {
            html += '<img src="/assets/themes/default/icons/iTunesArtwork@1x.png" alt="' + data.strTitle + '" style="opacity: 0.1;">';
        }
        html += '</div>';

        html += '<div class="card-content">';
        html += '<span class="price-used"><i class="used">' + data.strTitle + '</i></span>';
        html += '</div>';

        html += '<div class="card-action row center-align">Meld u aan voor prijs en voorraad.</div>';

        html += '</div>';

        //End Item
        html += '</li>';
        $('#resultlist').append(html);
    } else if (viewmode == 2) {
        var html = '<li class="col l4 m6 s12" brand="' + data.intProductBrandID + '" category="' + data.intProductCategoryID + '">';

        html += '<div class="card">';

        html += '<div class="card-image">';
        if (data.strImageURL != "") {
            html += '<img src="' + data.strImageURL + '" alt="' + data.strTitle + '">';
        } else {
            html += '<img src="/assets/themes/default/icons/iTunesArtwork@1x.png" alt="' + data.strTitle + '" style="opacity: 0.1;">';
        }
        html += '</div>';

        html += '<div class="card-content">';
        html += '<span class="price-used"><i class="used">' + data.strTitle + '</i></span>';
        html += '</div>';

        html += '<div class="card-action row">';
        html += '<span class="col s12"><span class="rating" title="5.0 Stars of 5"><i class="material-icons">star</i><i class="material-icons">star</i><i class="material-icons">star</i><i class="material-icons">star</i><i class="material-icons">star</i></span></span>';

        html += '</div>';

        html += '</div>';

        //End Item
        html += '</li>';
        $('#resultlist').append(html);
    }
}

function toggleViewMode() {
    if (viewmode == 0) {
        viewmode = 1;
    } else {
        viewmode = 0;
    }

    reloadData();
}

function reloadData() {
    page = 1;
    end = 0;
    active = 0;
    if (xhr && xhr.readystate != 4) {
        xhr.abort();
    }
    $.each(xhroffers, function (index, value) {
        if (value && value.readystate != 4) {
            value.abort();
        }
    });
    xhroffers = [];
    $('#results').html('<div class="progress"><div class="indeterminate"></div></div>');

    $('#category_' + categoryid).removeClass('active');
    $('#category_' + categoryid).addClass('active');

    page = 1;
    if (xhr && xhr.readystate != 4) {
        xhr.abort();
    }
    xhr = $.ajax({
        url: "/api/search",
        type: "GET",
        data: {
            term: term,
            page: page,
            category: categoryid,
            brand: brandid,
            sort: sort
        },
        cache: false,
        success: function (data) {
            if (viewmode == 0) {
                var viewhtml = '<div class="row red hide-on-med-and-down" style="padding: 1rem; color: #fff; margin-bottom: 0;"><div class="col l10">Product</div><div class="col l2"></div></div>';
                if (authenticated == 1) {
                    viewhtml = '<div class="row red hide-on-med-and-down" style="padding: 1rem; color: #fff; margin-bottom: 0;">';
                    if (hasPlatforms == 1) {
                        viewhtml += '<div class="col l1 m1 hide-small-screen" style="padding: 0; width: 3rem; height: 1rem;">';
                        viewhtml += '<input type="checkbox" class="filled-in queue-checkbox-all" id="queue-checkbox-all" /><label for="queue-checkbox-all"></label>';
                        viewhtml += '</div>';
                        viewhtml += '<div class="col l6 m6 s11">Product (Vink de producten aan die u wilt importeren)</div>';
                    } else {
                        viewhtml += '<div class="col l7 m7 s11">Product</div>';
                    }
                    viewhtml += '<div class="col l1 m1 hide-small-screen">Voorraad</div>';
                    viewhtml += '<div class="col l2 m2 hide-small-screen">Levertijd</div>';
                    viewhtml += '<div class="col l2 m2 hide-small-screen">Prijs (Excl. BTW)</div>';
                    viewhtml += '</div>';
                }
                viewhtml += '<ul id="resultlist" class="collapsible popout" data-collapsible="accordion" style="margin-top: 0;"></ul>';
                $('#results').html(viewhtml);
            } else {
                $('#results').html('<ul class="row product-list" id="resultlist"></ul>');
            }
            parseProducts(data);
        },
        error: function (data) {
            console.log(data);
        }
    });
}

function parseFirstProduct(value) {
    if (value.intStock > 0) {
        if (viewmode == 0) {
            var elementkey = Math.random().toString(36).substring(7);

            //Item
            var html = '<li style="position: relative;" class="product-item product-master-' + value.intProductID + '" product="' + value.intProductID + '" offer="' + value.intProductOfferID + '" stock="' + value.intStock + '" brand="' + value.intProductBrandID + '" category="' + value.intProductCategoryID + '">';

            if (value.intOfferCount > 1) {
                html += '<div id="product-loader-' + value.intProductID + '" style="position: absolute; bottom: 0px; width: 100%; height: 8px;"><div class="progress" style="opacity: 0.2;"><div class="indeterminate"></div></div></div>';
            }

            var checkAppend = '';
            if (value.intQuality >= 3) {
                checkAppend = ' filled-in-green';
            }

            if (hasPlatforms == 1) {
                html += '<div style="position: absolute; left: 1rem; top: 1rem;">';
                if ($("#queue-checkbox-all").is(':checked')) {
                    addToQueue(value.intProductID);
                    html += '<input type="checkbox" class="filled-in' + checkAppend + ' queue-checkbox" product="' + value.intProductID + '" id="queue-checkbox-' + elementkey + '" checked="checked" /><label for="queue-checkbox-' + elementkey + '"></label>';
                } else {
                    html += '<input type="checkbox" class="filled-in' + checkAppend + ' queue-checkbox" product="' + value.intProductID + '" id="queue-checkbox-' + elementkey + '" /><label for="queue-checkbox-' + elementkey + '"></label>';
                }
                html += '</div>';
            }

            //Header
            html += '<div class="collapsible-header" onclick="loadDetail(' + value.intProductID + ', ' + value.intProductOfferID + ', ' + value.intStock + ', ' + value.intMinDelivery + ', ' + value.intMaxDelivery + ');">';
            html += '<div class="row" style="margin-bottom: 0px;">';
            if (hasPlatforms == 1) {
                html += '<div class="col l1 m1" style="width: 3rem;">';
                html += '</div>';
                html += '<div class="col l6 m6 s10" style="overflow: hidden; height: 2rem; text-overflow: ellipsis; display: block; white-space: nowrap;">' + value.strTitle + '</div>';
            } else {
                html += '<div class="col l7 m7 s10" style="overflow: hidden; height: 2rem; text-overflow: ellipsis; display: block; white-space: nowrap;">' + value.strTitle + '</div>';
            }
            html += '<div class="col l1 m1 hide-small-screen"><span class="badge-delivery"><i class="material-icons grey-text" style="font-size: 1.2rem; margin-right: 0rem;">reorder</i>' + value.intStock + '</span></div>';
            html += '<div class="col l2 m2 hide-small-screen">';
            if (value.intMaxDelivery == 0) {
                if (value.intMinDelivery == 0) {
                    html += '<span class="badge-delivery"><i class="material-icons grey-text" style="font-size: 1.2rem; margin-right: 0rem;">today</i>3 - 5 Dagen</span>';
                } else {
                    if (value.intMinDelivery == 24) {
                        html += '<span class="badge-delivery badge-fast-delivery"><i class="material-icons grey-text" style="font-size: 1.2rem; margin-right: 0rem;">today</i>24H</span>';
                    } else {
                        var Days = value.intMinDelivery / 24;
                        html += '<span class="badge-delivery"><i class="material-icons grey-text" style="font-size: 1.2rem; margin-right: 0rem;">today</i>' + Days + ' Dagen</span>';
                    }
                }
            } else {
                if (value.intMinDelivery == 0) {
                    if (value.intMaxDelivery == 24) {
                        html += '<span class="badge-delivery badge-fast-delivery"><i class="material-icons grey-text" style="font-size: 1.2rem; margin-right: 0rem;">today</i>24H</span>';
                    } else {
                        var Days = value.intMaxDelivery / 24;
                        html += '<span class="badge-delivery"><i class="material-icons grey-text" style="font-size: 1.2rem; margin-right: 0rem;">today</i>' + Days + ' Dagen</span>';
                    }
                } else {
                    var MinDays = parseInt(value.intMinDelivery / 24);
                    var MaxDays = parseInt(value.intMaxDelivery / 24);
                    if (MinDays == 0) {
                        if (MaxDays == 1) {
                            html += '<span class="badge-delivery badge-fast-delivery"><i class="material-icons grey-text" style="font-size: 1.2rem; margin-right: 0rem;">today</i>24H</span>';
                        } else {
                            html += '<span class="badge-delivery"><i class="material-icons grey-text" style="font-size: 1.2rem; margin-right: 0rem;">today</i>' + MaxDays + ' Dagen</span>';
                        }
                    } else {
                        html += '<span class="badge-delivery"><i class="material-icons grey-text" style="font-size: 1.2rem; margin-right: 0rem;">today</i>' + MinDays + ' - ' + MaxDays + ' Dagen</span>';
                    }
                }
            }
            html += '</div>';

            if (parseFloat(parseFloat(value.douOldPrice).toFixed(2)) > parseFloat(parseFloat(value.douPrice).toFixed(2))) {
                html += '<div class="col l2 m2 hide-small-screen">&euro; ' + parseFloat(value.douPrice).toFixed(2).replace('.', ',') + ' <span class="red-text" style="text-decoration: line-through;">&euro; ' + parseFloat(value.douOldPrice).toFixed(2).replace('.', ',') + '</span></div>';
            } else {
                html += '<div class="col l2 m2 hide-small-screen">&euro; ' + parseFloat(value.douPrice).toFixed(2).replace('.', ',') + '</div>';
            }
            html += '<i class="material-icons" style="position: absolute; right: 0;">more_horizontal</i>';
            html += '</div>';
            html += '</div>';

            //Content
            html += '<div class="collapsible-body" style="position: relative; padding-bottom: 4rem;">';

            //Row
            html += '<div class="row">';

            //Left
            html += '<div id="gallery_' + value.intProductOfferID + '" class="col s12 m4 l4">';
            html += '<p style="text-align: center;">';
            html += '<img src="' + value.strImageURL + '" style="max-width: 90%; max-height: 320px;" />';
            html += '</p>';
            html += '</div>';

            //Right
            html += '<div class="col s12 m8 l8">';
            html += '<div class="light" id="detail_' + value.intProductOfferID + '">';

            html += '<div class="center-align" style="padding-top: 4rem;">';
            html += '<div class="preloader-wrapper small active">';
            html += '<div class="spinner-layer spinner-green-only">';
            html += '<div class="circle-clipper left">';
            html += '<div class="circle"></div>';
            html += '</div><div class="gap-patch">';
            html += '<div class="circle"></div>';
            html += '</div><div class="circle-clipper right">';
            html += '<div class="circle"></div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';
            html += '</div>';

            html += '</div>';
            html += '</div>';

            //End Row
            html += '</div>';

            //End Content
            html += '</div>';

            //End Item
            html += '</li>';
            $('#resultlist').append(html);

            $('#queue-checkbox-' + elementkey).click(function (e) {
                if ($(this).is(':checked')) {
                    addToQueue($(this).attr('product'));
                } else {
                    removeFromQueue($(this).attr('product'));
                }
            });
        } else if (viewmode == 1) {
            var html = '<li class="col l2 m6 s12 product-master-' + value.intProductID + '" brand="' + value.intProductBrandID + '" category="' + value.intProductCategoryID + '">';

            if (authenticated == 1) {
                //Modal
                html += '<div id="detailmodal_' + value.intProductOfferID + '" class="modal" style="background-color: #fff;">';

                //Row
                html += '<div class="row" style="padding: 2rem 2rem 6rem 2rem; position: relative;">';

                //Left
                html += '<div id="gallery_' + value.intProductOfferID + '" class="col s12 m4 l4">';
                html += '<p style="text-align: center;">';
                html += '<img src="' + value.strImageURL + '" style="max-width: 90%; max-height: 320px;" />';
                html += '</p>';
                html += '</div>';

                //Right
                html += '<div class="col s12 m8 l8">';
                html += '<div class="light" id="detail_' + value.intProductOfferID + '">';

                html += '<div class="center-align" style="padding-top: 4rem;">';
                html += '<div class="preloader-wrapper small active">';
                html += '<div class="spinner-layer spinner-green-only">';
                html += '<div class="circle-clipper left">';
                html += '<div class="circle"></div>';
                html += '</div><div class="gap-patch">';
                html += '<div class="circle"></div>';
                html += '</div><div class="circle-clipper right">';
                html += '<div class="circle"></div>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
                html += '</div>';

                html += '</div>';
                html += '</div>';

                //End Row
                html += '</div>';

                //Close Button
                html += '<div class="modal-close">X</div>';

                //End Modal
                html += '</div>';
            }
            html += '<div class="card">';

            html += '<div class="card-image" onclick="loadDetail(' + value.intProductID + ', ' + value.intProductOfferID + ', ' + value.intStock + ');">';
            if (value.strImageURL != "") {
                html += '<img src="' + value.strImageURL + '" alt="' + value.strTitle + '">';
            } else {
                html += '<img src="/assets/themes/default/icons/iTunesArtwork@1x.png" alt="' + value.strTitle + '" style="opacity: 0.1;">';
            }
            html += '</div>';

            html += '<div class="card-content" onclick="loadDetail(' + value.intProductID + ', ' + value.intProductOfferID + ', ' + value.intStock + ');">';
            html += '<span class="price-used"><i class="used">' + value.strTitle + '</i></span>';
            html += '</div>';

            html += '<div class="card-action row">';
            if (authenticated == 1) {
                html += '<span class="col s6">&euro; ' + parseFloat(value.douPrice).toFixed(2).replace('.', ',') + '</span>';
                html += '<span class="col s6 price">';

                html += '<a class="dropdown-button" href="#!" data-activates="addto_' + value.intProductOfferID + '">Voeg toe<i class="material-icons right" style="font-size: 20px; margin-left: 0px;">arrow_drop_down</i></a>';

                html += '<ul id="addto_' + value.intProductOfferID + '" class="dropdown-content">';
                html += '<li onclick="addOneOfferToCart(' + value.intProductOfferID + ');"><a href="#" onclick="return false;"><i class="material-icons">shopping_cart</i></a></li>';
                html += '<li class="divider"></li>';
                html += '<li onclick="addToPlatform(' + value.intProductID + ');"><a href="#" onclick="return false;">Wachtrij</a></li>';
                html += '</ul>';

                html += '</span>';
            } else {
                html += '<span class="col s12"><span class="rating" title="5 van de 5 sterren"><i class="material-icons">star</i><i class="material-icons">star</i><i class="material-icons">star</i><i class="material-icons">star</i><i class="material-icons">star</i></span></span>';
            }

            html += '</div>';

            if (authenticated == 1) {
                html += '<div style="position: absolute; right:0.4rem; top: 0.4rem;"><i class="material-icons grey-text" style="font-size: 1.6rem; margin-right: 0.2rem;">reorder</i><span style="position: relative; top: -0.4rem;">' + value.intStock + '</span></div>';
            }

            html += '</div>';

            //End Item
            html += '</li>';
            $('#resultlist').append(html);
            $('.dropdown-button').dropdown();
        }
    }

}

function parseData(data, value) {
    if (viewmode == 0 || viewmode == 1) {
        $.each(JSON.parse(data), function (index, offer) {
            if (offer.intProductOfferID != value.intProductOfferID && offer.intStock > 0) {
                if (viewmode == 0) {
                    var elementkey = Math.random().toString(36).substring(7);

                    //Item
                    var html = '<li style="position: relative;" class="product-item product-child-' + value.intProductID + '" product="' + value.intProductID + '" offer="' + offer.intProductOfferID + '" stock="' + offer.intStock + '" brand="' + value.intProductBrandID + '" category="' + value.intProductCategoryID + '">';

                    //Header
                    html += '<div class="collapsible-header" onclick="loadDetail(' + value.intProductID + ', ' + offer.intProductOfferID + ', ' + offer.intStock + ');">';
                    html += '<div class="row" style="margin-bottom: 0px;">';
                    if (hasPlatforms == 1) {
                        html += '<div class="col l1 m1 hide-small-screen" style="width: 3rem;">';
                        html += '</div>';
                        html += '<div class="col l6 m6 s11" style="overflow: hidden; height: 2rem; text-overflow: ellipsis; display: block; white-space: nowrap;">' + value.strTitle + '</div>';
                    } else {
                        html += '<div class="col l7 m6 s11" style="overflow: hidden; height: 2rem; text-overflow: ellipsis; display: block; white-space: nowrap;">' + value.strTitle + '</div>';
                    }
                    html += '<div class="col l1 m1 hide-small-screen"><span class="badge-delivery"><i class="material-icons grey-text" style="font-size: 1.2rem; margin-right: 0rem;">reorder</i>' + offer.intStock + '</span></div>';
                    html += '<div class="col l2 m2 hide-small-screen">';
                    html += '<span class="badge-delivery"><i class="material-icons grey-text" style="font-size: 1.2rem; margin-right: 0rem;">today</i>3 - 5 Dagen</span>';
                    html += '</div>';
                    if (parseFloat(offer.douOldPrice) > parseFloat(offer.douPrice)) {
                        html += '<div class="col l2 m2 hide-small-screen">&euro; ' + parseFloat(offer.douPrice).toFixed(2).replace('.', ',') + ' <span class="red-text" style="text-decoration: line-through;">&euro; ' + parseFloat(offer.douOldPrice).toFixed(2).replace('.', ',') + '</span></div>';
                    } else {
                        html += '<div class="col l2 m2 hide-small-screen">&euro; ' + parseFloat(offer.douPrice).toFixed(2).replace('.', ',') + '</div>';
                    }
                    html += '<i class="material-icons" style="position: absolute; right: 0;">more_horizontal</i>';
                    html += '</div>';
                    html += '</div>';

                    //Content
                    html += '<div class="collapsible-body" style="position: relative; padding-bottom: 4rem;">';

                    //Row
                    html += '<div class="row">';

                    //Left
                    html += '<div id="gallery_' + offer.intProductOfferID + '" class="col s12 m4 l4">';
                    html += '<p style="text-align: center;">';
                    html += '<img src="' + value.strImageURL + '" style="max-width: 90%; max-height: 320px;" />';
                    html += '</p>';
                    html += '</div>';

                    //Right
                    html += '<div class="col s12 m8 l8">';
                    html += '<div class="light" id="detail_' + offer.intProductOfferID + '">';

                    html += '<div class="center-align" style="padding-top: 4rem;">';
                    html += '<div class="preloader-wrapper small active">';
                    html += '<div class="spinner-layer spinner-green-only">';
                    html += '<div class="circle-clipper left">';
                    html += '<div class="circle"></div>';
                    html += '</div><div class="gap-patch">';
                    html += '<div class="circle"></div>';
                    html += '</div><div class="circle-clipper right">';
                    html += '<div class="circle"></div>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';
                    html += '</div>';

                    html += '</div>';
                    html += '</div>';

                    //End Row
                    html += '</div>';

                    //End Content
                    html += '</div>';

                    //End Item
                    html += '</li>';
                    $('.product-master-' + value.intProductID).after(html);

                    $('#queue-checkbox-' + elementkey).click(function (e) {
                        if ($(this).is(':checked')) {
                            addToQueue($(this).attr('product'));
                        } else {
                            removeFromQueue($(this).attr('product'));
                        }
                    });
                } else if (viewmode == 1) {
                    var html = '<li class="col l2 m6 s12" brand="' + value.intProductBrandID + '" category="' + value.intProductCategoryID + '">';

                    if (authenticated == 1) {
                        //Modal
                        html += '<div id="detailmodal_' + offer.intProductOfferID + '" class="modal" style="background-color: #fff;">';

                        //Row
                        html += '<div class="row" style="padding: 2rem 2rem 6rem 2rem; position: relative;">';

                        //Left
                        html += '<div id="gallery_' + offer.intProductOfferID + '" class="col s12 m12 l4">';
                        html += '<p style="text-align: center;">';
                        html += '<img src="' + value.strImageURL + '" style="max-width: 90%; max-height: 320px;" />';
                        html += '</p>';
                        html += '</div>';

                        //Right
                        html += '<div class="col s12 m12 l8">';
                        html += '<div class="light" id="detail_' + offer.intProductOfferID + '">';

                        html += '<div class="center-align" style="padding-top: 4rem;">';
                        html += '<div class="preloader-wrapper small active">';
                        html += '<div class="spinner-layer spinner-green-only">';
                        html += '<div class="circle-clipper left">';
                        html += '<div class="circle"></div>';
                        html += '</div><div class="gap-patch">';
                        html += '<div class="circle"></div>';
                        html += '</div><div class="circle-clipper right">';
                        html += '<div class="circle"></div>';
                        html += '</div>';
                        html += '</div>';
                        html += '</div>';
                        html += '</div>';

                        html += '</div>';
                        html += '</div>';

                        //End Row
                        html += '</div>';

                        //End Modal
                        html += '</div>';
                    }
                    html += '<div class="card">';

                    html += '<div class="card-image" onclick="loadDetail(' + value.intProductID + ', ' + offer.intProductOfferID + ', ' + offer.intStock + ');">';
                    if (value.strImageURL != "") {
                        html += '<img src="' + value.strImageURL + '" alt="' + value.strTitle + '">';
                    } else {
                        html += '<img src="/assets/themes/default/icons/iTunesArtwork@1x.png" alt="' + value.strTitle + '" style="opacity: 0.1;">';
                    }
                    html += '</div>';

                    html += '<div class="card-content" onclick="loadDetail(' + value.intProductID + ', ' + offer.intProductOfferID + ', ' + offer.intStock + ');">';
                    html += '<span class="price-used"><i class="used">' + value.strTitle + '</i></span>';
                    html += '</div>';

                    html += '<div class="card-action row">';
                    if (authenticated == 1) {
                        html += '<span class="col s6">&euro; ' + parseFloat(offer.douPrice).toFixed(2).replace('.', ',') + '</span>';
                        html += '<span class="col s6 price">';

                        html += '<a class="dropdown-button" href="#!" data-activates="addto_' + offer.intProductOfferID + '">Voeg toe<i class="material-icons right" style="font-size: 20px; margin-left: 0px;">arrow_drop_down</i></a>';

                        html += '<ul id="addto_' + offer.intProductOfferID + '" class="dropdown-content">';
                        html += '<li onclick="addOneOfferToCart(' + offer.intProductOfferID + ');"><a href="#" onclick="return false;">Wagen</a></li>';
                        html += '<li class="divider"></li>';
                        html += '<li onclick="addToPlatform(' + offer.intProductID + ');"><a href="#" onclick="return false;">Wachtrij</a></li>';
                        html += '</ul>';

                        html += '</span>';
                    } else {
                        html += '<span class="col s12"><span class="rating" title="5 van de 5 sterren"><i class="material-icons">star</i><i class="material-icons">star</i><i class="material-icons">star</i><i class="material-icons">star</i><i class="material-icons">star</i></span></span>';
                    }

                    html += '</div>';

                    if (authenticated == 1) {
                        html += '<div style="position: absolute; right:0.4rem; top: 0.4rem;"><i class="material-icons grey-text" style="font-size: 1.6rem; margin-right: 0.2rem;">reorder</i><span style="position: relative; top: -0.4rem;">' + value.intStock + '</span></div>';
                    }

                    html += '</div>';

                    //End Item
                    html += '</li>';
                    $('.product-master-' + value.intProductID).after(html);
                    $('.dropdown-button').unbind().removeData();
                    $('.dropdown-button').dropdown();
                }
            }
        });
    }

    if (viewmode == 2) {
        var html = '<li class="col l4 m6 s12" brand="' + value.intProductBrandID + '" category="' + value.intProductCategoryID + '">';

        html += '<div class="card">';

        html += '<div class="row">';

        html += '<div class="col l6 m12 s12">';
        html += '<div class="card-image">';
        if (value.strImageURL != "") {
            html += '<img src="' + value.strImageURL + '" alt="' + value.strTitle + '">';
        } else {
            html += '<img src="/assets/themes/default/icons/iTunesArtwork@1x.png" alt="' + value.strTitle + '" style="opacity: 0.1;">';
        }
        html += '</div>';
        html += '</div>';
        html += '<div class="col l6 m12 s12" style="padding-top: 1rem;">';
        $.each(JSON.parse(data), function (index, offer) {
            html += '<div class="row">';
            html += '<div class="col s12 m12 l3">' + offer.intStock + '</div>';
            html += '<div class="col s12 m12 l6">&euro; ' + parseFloat(offer.douPrice).toFixed(2).replace('.', ',') + '</div>';

            html += '<div class="col s12 m12 l3">';
            html += '<a class="dropdown-button" href="#!" data-activates="addto_' + offer.intProductOfferID + '"><i class="material-icons right" style="font-size: 16px; margin-left: 0px;">arrow_drop_down</i></a>';

            html += '<ul id="addto_' + offer.intProductOfferID + '" class="dropdown-content">';
            html += '<li onclick="addOneOfferToCart(' + offer.intProductOfferID + ');"><a href="#" onclick="return false;">Wagen</a></li>';
            html += '<li class="divider"></li>';
            html += '<li onclick="addToPlatform(' + offer.intProductID + ');"><a href="#" onclick="return false;">Wachtrij</a></li>';
            html += '</ul>';
            html += '</div>';

            html += '</div>';
        });
        html += '</div>';

        html += '</div>';

        html += '<div class="card-content">';
        html += '<span class="price-used"><i class="used">' + value.strTitle + '</i></span>';
        html += '</div>';

        html += '<div class="card-action row">';
        html += '<span class="col s12"><span class="rating" title="5 van de 5 sterren"><i class="material-icons">star</i><i class="material-icons">star</i><i class="material-icons">star</i><i class="material-icons">star</i><i class="material-icons">star</i></span></span>';
        html += '</div>';

        html += '</div>';

        //End Item
        html += '</li>';
        $('#resultlist').append(html);
        $('.dropdown-button').unbind().removeData();
        $('.dropdown-button').dropdown();
    }
}
