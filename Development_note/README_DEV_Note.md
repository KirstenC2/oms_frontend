# Vue Note


## What is onMOunted?
1. onMounted (Lifecycle Hook)
- lifecycle hook whicch run only once
onMounted is a lifecycle hook that allows you to run code after your component has been mounted (i.e., inserted into the DOM) for the first time.

Purpose: To perform side effects that require the component's DOM elements to be present.

When it runs: It runs only once when the component is initially rendered and added to the document. It does not re-run on subsequent updates to the component's data.

### Common Use Cases:

1. Initial Data Fetching: 
- loading data from an API as soon as the component is ready.

2. DOM Manipulation: 
- Accessing and manipulating the component's root DOM element or other elements within its template using template refs.

3. Integrating Third-Party Libraries: 
- Initializing chart libraries, map widgets, or other JavaScript libraries that need a DOM element to attach to.

4. Setting up Event Listeners (non-Vue): 
- Adding global event listeners (e.g., window.addEventListener) that need to be cleaned up when the component unmounts.


## what is watch?
- reactivity (ref/reactivity)