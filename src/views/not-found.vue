<template>
  <div class="page-not-found d-flex align-items-center justify-content-center">
    <div class="section-not-found text-center">
      <div class="text-primary font-weight-bold title mb-2">Something went wrong!</div>
      <div class="mb-3 sub-title">
        Sorry, we were unable to find the page you requested
      </div>
      <div class="back-link-wrap">
        <router-link to="/" class="font-weight-bold">
          Go back to the homepage
        </router-link>
      </div>
      <div class="err-img-wrap mx-auto">
        <img src="@/assets/images/error-img.png" alt="Error" class="img-fluid" />
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'not-found',
  components: {},
};
</script>

<style lang="scss">
.page-header {
  box-shadow: 0 4px 8px -4px #bdc1cf;
  padding: 0.75rem 1rem;

  .logo-wrap {
    margin-left: 2rem;
    max-width: 100px;
  }
}
.page-not-found {
  min-height: calc(100vh - 60px);
}
.title {
  font-size: 56px;
  line-height: 1.2;
}
.sub-title {
  font-size: 1rem;
}
.section-not-found {
  text-align: center;
}
.err-img-wrap {
  max-width: 680px;
}

.back-link-wrap {
  margin-bottom: 112px;
}

@include media-breakpoint-down(sm) {
  .title {
    font-size: 32px;
  }

  .sub-title {
    font-size: 14px;
  }

  .title,
  .sub-title {
    padding: 0 0.5rem;
  }

  .page-header .logo-wrap {
    margin-left: 0;
  }

  .back-link-wrap {
    margin-bottom: 51px;
  }
}
</style>
