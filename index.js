$(document).ready(() => {
    var doctors 
    var filter = {
        name: [],
        gender: [],
        location: [],
        specialisation: [],
        language: []
    }
    var currentData

    $.getJSON('doctors.json' , (data) => {
        var count = 0;
        doctors = data.slice(0,5).map((item) => {
            return item
        })
        console.log(doctors[0])
        currentData = doctors
        populateDoctors(doctors)        
    })

    function clearFilter() {
        filter = {
            name: [],
            gender: [],
            location: [],
            specialisation: [],
            language: []
        }
        populateDoctors()
    }

    const filterDataContainer = $('div#filter-data')
    function addFilterDataToList(){
        var filterFragment = document.createDocumentFragment()
        $.map(filter, (element) => {
            element.forEach(value => {
                var filterTemplate = document.querySelector("div.filter-item[data-type='template']").cloneNode(true)
                $(filterTemplate).find('span.filter-value').text(value)
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

    const searchbox = $('#search')
    searchbox.on('input', 'input:text', (e) => {
        var result;
        var searchvalue = e.target.value.toUpperCase()

        result = $.map(doctors, (item) => {
            var match = item.name.toUpperCase().indexOf(searchvalue) !== -1
            return match ? item : null
        })

        currentData = result
        populateDoctors()
    })

    const genderfilter = $('#filter-by-gender')
    genderfilter.change((e) => {
        var value = e.target.value
        if(value === "All"){
            clearFilter()
        }
        else{
            if($.inArray(value,filter.gender) < 0){
                filter.gender.push(value)
            }
        }
        populateDoctors()
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

        if(filter.language.length > 0){
            result = $.grep(result, (item,index) => {
                isItemValid = false
                filter.language.forEach(language => {
                    if(item.language === language){
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
        console.log(filteredData)
        var keys = Object.keys(filteredData)
        var fragment = document.createDocumentFragment()
        for(var i = 0;i < keys.length; i++){
            var template = document.querySelector(".doctor[data-type='template']").cloneNode(true)
            $(template).find('div.avatar').append("<img src='https://robohash.org/placeatevenietminima.png?size=50x50&set=set1'/>")
            $(template).find('h5.name').text(filteredData[i].name)
            $(template).find('h6.department').text(filteredData[i].department)
            $(template).find('div.qualifications').text(filteredData[i].qualifications)
            $(template).find('span.duration-value').text(filteredData[i].duration)
            $(template).find('span.fees-value').text(filteredData[i].fees)
            template.style.display = 'block'
            fragment.appendChild(template)
        }
        
        $('.doctors-list').empty()
        $('.doctors-list').append(fragment)
        delete fragment
    }
})