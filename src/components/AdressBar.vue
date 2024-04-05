<template>
  <q-input
    filled
    type="text"
    ref="searchInput"
    v-model="model.label"
    :label="props.label"

    v-on:update:modelValue="searchAddress()"
    v-on:focusin="onSetFocus(true)"
    v-on:focusout="onSetFocus(false)"
  />
  <ul ref="dropdownMenu" class="dropdown-menu">
    <q-item class="dropdown-item" v-for="suggestion in suggestions" :key="suggestion.mapbox_id"
        clickable v-on:click="selectAddress(suggestion)">
      <q-item-section>
        <q-item-label>
          <q-icon :name="suggestion.icon" class="col" avatar/>
            {{suggestion.label}}
        </q-item-label>
        <q-item-label caption>{{suggestion.description}}</q-item-label>
      </q-item-section>
      <!--{{formatLabel(suggestion.label,'start')}}<span class="text-primary">{{formatLabel(suggestion.label,'middle')}}</span>{{formatLabel(suggestion.label, 'end')}}-->
    </q-item>
  </ul>
</template>

<script setup>


import {onMounted, reactive, ref, watch} from 'vue'

// mapbox options as per https://docs.mapbox.com/api/search/geocoding/
  const mapboxOptionsBar = {
    //api: 'https://api.mapbox.com/geocoding/v5/',
    api: 'https://api.mapbox.com/search/searchbox/v1/',
    endpoint: 'suggest',
    access_token: 'pk.eyJ1IjoiZmlyZWdyZWVrcyIsImEiOiJjam9rbHZ6cXIwMHhyM2tvMmJ5dDBuZjh2In0.rnsYShGrQvcgyEi_FbTjtg',
    limit: 5,
    session_token:'[GENERATED-UUID]',
    types:'address,city,poi,street,neighborhood',
    poi_category:'airport,public_transportation_station,bus_station,railway_station'
  }
  const dropdownMenu = ref()
  const searchInput = ref()
  const suggestions = reactive([])

  watch(suggestions, ()=>setTimeout(calculateDropdownPosition, 100))

  const model = defineModel({
    default: {
      label: '',
      coordinates: [],
      suggestion: {}
    }
  })
  const emit = defineEmits(['addressSelect'])
  const props = defineProps({
    mapboxOptions : Object,
    label: String
  })


  Object.assign(mapboxOptionsBar, props.mapboxOptions)

  function onSetFocus(value) {
    if (value === true) {
      if (suggestions.length > 0)
        dropdownMenu.value.classList.add('show');
    }
    if (value === false) {
      setTimeout(() => {
        dropdownMenu.value.classList.remove('show');
      }, 100)
    }
  }

  async function searchAddress() {
    if (model.value.label.length >= 2) {
      Object.assign(suggestions, await getSuggestions(model.value.label))
      dropdownMenu.value.classList.add('show')
    } else {
      dropdownMenu.value.classList.remove('show')
    }
  }

  async function selectAddress(suggestion) {
    dropdownMenu.value.classList.remove('show')

    model.value.label = suggestion.label
    model.value.category = suggestion.category;

    model.value.coordinates = await retrieveSuggestionCoordinates(suggestion.mapbox_id)

    emit('addressSelect', suggestion)
  }

  async function getSuggestions(street) {
    if (street.length >= 2) {
      let searchText = encodeURIComponent(street)
      let {api, endpoint, ...query} = mapboxOptionsBar
      let queryString = new URLSearchParams(query).toString()
      let request = new Request(`${api+endpoint}?q=${searchText}&${queryString}`)
      let response = await fetch(request)
      let data = await response.json()

      if (data["suggestions"]) {
        return data["suggestions"].map(suggestion => {

          let icon = 'place'
          let category = 'place'

          if (suggestion["feature_type"] === 'poi') {
            const poi_category = suggestion['poi_category']

            if (poi_category.includes('airport'))
              [category, icon] = ['airport', 'flight']
            else if (poi_category.includes('bus station'))
              [category, icon] = ['bus station', 'directions_bus']
            else if (poi_category.includes('train station'))
              [category, icon] = ['train station', 'train']
            else if (poi_category.includes('public transportation station'))
              [category, icon] = ['public transport station', 'train']
          }

          return {
            mapbox_id: suggestion["mapbox_id"],
            label: suggestion["name_preferred"] ? suggestion["name_preferred"] : suggestion["name"],
            description: suggestion["place_formatted"],
            category: category,
            icon: icon
          }

        })
      } else {
        console.log(data.message)
      }
    }
  }

  async function retrieveSuggestionCoordinates(mapboxID) {
    let {api, access_token, session_token} = mapboxOptionsBar
    let queryString = new URLSearchParams({
      access_token: access_token,
      session_token: session_token
    }).toString()

    let request = new Request(`${api}retrieve/${mapboxID}?${queryString}`)
    let response = await fetch(request)
    let data = await response.json()

    if (data["features"]) {
      return data["features"][0]["geometry"]["coordinates"]
    } else {
      console.log(data.message)
    }

  }

  function calculateDropdownPosition() {
    const bounds = searchInput.value.getNativeElement().getBoundingClientRect();
    const dropDownHeight = dropdownMenu.value.offsetHeight;

    let top;
    if (window.innerHeight - bounds.bottom < dropDownHeight) {
      top = bounds.top - dropDownHeight
    } else {
      top = bounds.bottom
    }

    dropdownMenu.value.style.left = bounds.left + 'px';
    dropdownMenu.value.style.top = top + "px";
  }

  onMounted(() => {
    window.addEventListener('scroll', () => onSetFocus(false));
  })
</script>

<style scoped>


  .dropdown-menu.show {
    display: block;
  }
  .dropdown-menu {
    position: fixed;
    z-index: 1000;
    display: none;
    min-width: 20rem;
    padding: .5rem 0;
    margin: 0 0 0 -.7rem;
    font-size: 1rem;
    list-style: none;
    background-color: #fff;
    background-clip: padding-box;
    border: 1px solid rgba(0, 0, 0, .15);
    border-radius: .25rem;
    max-width: 500px;
  }

  .dropdown-item{
    padding: .5rem .5rem .5rem .5rem;
    text-overflow: clip;
    white-space: nowrap;
    overflow: hidden;
  }





</style>
