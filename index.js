$(document).ready(() => {
    var doctors 
    var filter = {
        name: [],
        gender: [],
        location: [],
        specialisation: [],
        languages: [],
        availability:[]
    }
    var currentData

    // Getting initial ddata of doctors list
    $.getJSON('doctors.json' , (data) => {
        var count = 0;
        doctors = data.slice(0,25).map((item) => {
            return item
        })
        currentData = doctors
        populateDoctors(doctors)        
    })

    // Method to clear the filters
    function clearFilter() {
        filter = new Object({
            name: [],
            gender: [],
            location: [],
            specialisation: [],
            languages: [],
            availability:[]
        })
        populateDoctors()
    }

    // Clear Individual Filter
    function clearIndividualFilter(value){

        if(value === "Available"){
            value = "true"
        }else if(value === "Not Available"){
            value = "false"
        }

        $.map(filter, (element,key) => {

            var index = $.inArray(value,element)
            if(index >= 0){
                element.splice(index,1)
            }

        })

        populateDoctors()
    }

    // Method to add filters to the list
    function addFilterDataToList(){
        var filterFragment = document.createDocumentFragment()
        $.map(filter, (element) => {
            element.forEach(value => {
                if(value == 'true'){
                    value = "Available"
                }else if(value == 'false'){
                    value = "Not Available"
                }
                var filterTemplate = document.querySelector("div.filter-item[data-type='template']").cloneNode(true)
                $(filterTemplate).find('span.filter-value').text(value)
                $(filterTemplate).find('.filter-item-close').on('click', (e) => {
                    clearIndividualFilter($(e.currentTarget).prev().text())
                })
                filterTemplate.style.display = "block"
                filterFragment.appendChild(filterTemplate)
            });
        });

        if(filterFragment.childElementCount > 0){
            var clearButtonTemplate = document.querySelector("button.clear-button").cloneNode(true)
            clearButtonTemplate.style.display = "block"
            $(clearButtonTemplate).on('click', clearFilter)
            filterFragment.appendChild(clearButtonTemplate)
        }

        $('#filter-data').empty()
        $('#filter-data').append(filterFragment)
        delete filterFragment
    }

    // Search method
    $('#search').on('input', 'input:text', (e) => {
        var result;
        var searchvalue = e.target.value.toUpperCase()

        result = $.map(doctors, (item) => {
            var match = item.name.toUpperCase().indexOf(searchvalue) !== -1
            return match ? item : null
        })

        currentData = result
        populateDoctors()
    })

    // Gender filter input
    $('.gender-dropdown-item').on('click', (e) => {
        var value = e.target.value
        if($.inArray(value,filter.gender) < 0){
            filter.gender.push(value)
        }
        populateDoctors()
    })

    // Specialisation filter
    $('.specialisation-dropdown-item').on('click', (e) => {
        var value = e.target.value
        if($.inArray(value,filter.specialisation) < 0){
            filter.specialisation.push(value)
        }
        populateDoctors()
    })

    // Availabiity filter
    $('.availability-dropdown-item').on('click', (e) => {
        var value = $(e.target).attr('data')
        if($.inArray(value,filter.availability) < 0){
            filter.availability.push(value)
        }
        populateDoctors()
    })

    // Location filter
    $('.location-dropdown-item').on('click', (e) => {
        var value = e.target.value
        if($.inArray(value,filter.location) < 0){
            filter.location.push(value)
        }
        populateDoctors()
    })

    // Language filter
    $('.language-dropdown-item').on('click', (e) => {
        var value = e.target.value
        if($.inArray(value,filter.location) < 0){
            filter.languages.push(value)
        }
        populateDoctors()
    })

    // Sort handler
    $('.sort-dropdown-item').on('click', (e) => {
        var value = e.target.value
        var text = $(e.currentTarget).text()

        $('#sort-by').text("Sort By: " + text)

        switch(value){

            case "alp": 
                currentData = sortByAsc(currentData,"name")
                populateDoctors()
                break;

            case "dhf": 
                currentData = sortByDesc(currentData,"duration")
                populateDoctors()
                break;

            case "fhf": 
                currentData = sortByDesc(currentData,"fees")
                populateDoctors()
                break;

            case "dlf": 
                currentData = sortByAsc(currentData,"duration")
                populateDoctors()
                break;

            case "flf": 
                currentData = sortByAsc(currentData,"fees")
                populateDoctors()
                break;

            default : break;
        }
    })

    // Handle side menu drawer
    $('.menu-button').on('click', (e) => {
        $('.sidebar').animate({
            left: "0"
        }, 500)
    })
    $('.side-menu-close').on('click', (e) => {
        $('.sidebar').animate({
            left: "-350PX"
        }, 500)
    })

    // Search panel expander
    $('.searchpanel-expander').on('click', (e) => {

        var element = $(e.target).children()
        var expandedClassName = 'expanded'

        if($(element).hasClass(expandedClassName)){
            $(element).removeClass(expandedClassName)
            $('.filter-choices').removeClass(expandedClassName)
            $('.sort-doctors').removeClass(expandedClassName)
        }else{
            $(element).addClass(expandedClassName)
            $('.filter-choices').addClass(expandedClassName)
            $('.sort-doctors').addClass(expandedClassName)
        }
    })

    $(window).on('resize', () => {
        var element = $('.searchpanel-expander').children()
        if(window.innerWidth > 600){
            $(element).removeClass('expanded')
            $('.filter-choices').removeClass('expanded')
            $('.sort-doctors').removeClass('expanded')
        }
        else if(window.innerWidth <= 600){
            $(element).addClass('expanded')
            $('.filter-choices').addClass('expanded')
            $('.sort-doctors').addClass('expanded')
        }
    })

    function filterData(data){
       
        var result = data

        if(filter.gender.length > 0){
            result = $.grep(result, (item,index) => {
                isItemValid = false
                filter.gender.forEach(gender => {
                    if(item.gender === gender){
                        isItemValid = true
                    }
                });
                if(isItemValid){
                    return item
                }
            })
        }

        if(filter.specialisation.length > 0){
            result = $.grep(result, (item,index) => {
                isItemValid = false
                filter.specialisation.forEach(specialisation => {
                    if(item.specialisation === specialisation){
                        isItemValid = true
                    }
                });
                if(isItemValid){
                    return item
                }
            })
        }

        if(filter.availability.length > 0){
            result = $.grep(result, (item,index) => {
                isItemValid = false
                filter.availability.forEach(availability => {
                    if(item.availability === JSON.parse(availability)){
                        isItemValid = true
                    }
                });
                if(isItemValid){
                    return item
                }
            })
        }

        if(filter.location.length > 0){
            result = $.grep(result, (item,index) => {
                isItemValid = false
                filter.location.forEach(location => {
                    if(item.location === location){
                        isItemValid = true
                    }
                });
                if(isItemValid){
                    return item
                }
            })
        }

        if(filter.languages.length > 0){
            result = $.grep(result, (item,index) => {
                isItemValid = false
                filter.languages.forEach(language => {
                    if($.inArray(language,item.languages) >= 0){
                        isItemValid = true
                    }
                });
                if(isItemValid){
                    return item
                }
            })
        }

        if(filter.name.length > 0){
            result = $.grep(result, (item,index) => {
                isItemValid = false
                filter.name.forEach(name => {
                    if(item.name === name){
                        isItemValid = true
                    }
                });
                if(isItemValid){
                    return item
                }
            })
        }

        return result
    }

    function populateDoctors(){
        
        addFilterDataToList()
        var filteredData = filterData(currentData)
        var keys = Object.keys(filteredData)
        var fragment = document.createDocumentFragment()
        for(var i = 0;i < keys.length; i++){
            var template = document.querySelector(".doctor[data-type='template']").cloneNode(true)
            $(template).find('div.avatar').append("<img src='https://robohash.org/placeatevenietminima.png?size=50x50&set=set1'/>")
            $(template).find('h6.name').text(filteredData[i].name)
            $(template).find('h6.department').text(filteredData[i].department)
            $(template).find('div.qualifications').text(filteredData[i].qualifications)
            $(template).find('span.duration-value').text(filteredData[i].duration)
            $(template).find('span.fees-value').text(filteredData[i].fees)
            template.style.display = 'block'
            fragment.appendChild(template)
        }
        
        $('.doctors-list').empty()
        $('.doctors-list').append(fragment)
        $('#doctor-number').text(filteredData.length)
        delete fragment
    }

    function sortByDesc(array, key){
        return array.sort((a,b) => {
            var x = a[key]
            var y = b[key]
            return (x > y) ? -1 : ((x < y) ? 1 : 0)
        })
    }
    
    function sortByAsc(array, key){
        return array.sort((a,b) => {
            var x = a[key]
            var y = b[key]
            return (x < y) ? -1 : ((x > y) ? 1 : 0)
        })
    }
})