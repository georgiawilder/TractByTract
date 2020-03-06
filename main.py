import sys 
import numpy as np
import pymc3 as pm
import pandas as pd
import theano 
import seaborn as sns
from theano import shared
from pymc3 import Model, sample, Normal, HalfCauchy, Uniform, model_to_graphviz
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt


def add_predictions_to_X(X, ppc): 
    prediction_arr = get_avg_pred(ppc)
    prediction_arr = pd.DataFrame(prediction_arr)
    prediction_arr.columns= ["Prediction"]
    res = X.reset_index().join(prediction_arr)
    return res 
def get_pred(X, y, new_idx, trace, model):  
    
    idx_shared.set_value(np.asarray(new_idx))
    print("IDX shape",idx_shared.get_value().shape)
    for i in range(len(parameters)):
        X_shared[i].set_value(np.asarray(X[parameters[i]].values))
    y_shared.set_value(y)
    print("X shape and y shape", X_shared[0].get_value().shape, y_shared.get_value().shape)
    with model: 
        ppc_pred = pm.sample_posterior_predictive(trace, samples=500)
        print("pred shape", ppc_pred['mrr_like'].shape)
    
    return ppc_pred

def get_avg_pred(ppc):
    prediction_arr = [] 
    for i in range(len(ppc['mrr_like'][0,:])):
        predictions = ppc['mrr_like'][:,i]
        avg = predictions.mean()
        prediction_arr.append(avg)
    return prediction_arr 

def make_plot(y):
    observed = pd.Series(y)
    ax = sns.distplot(observed)
    return ax 

def make_figures(trace, ppc, name): 
    plt.plot(trace['step_size_bar'])
    plt.savefig(name+'_step_size_bar.png')
    _, ax = plt.subplots(figsize=(12, 2))
    ax.hist([n.mean() for n in ppc['mrr_like']])
    ax.axvline(data.MRR_2010.mean())
    ax.set(title='Posterior predictive of the mean', xlabel='mean(x)', ylabel='Frequency')
    plt.savefig(name+'_histo.png')

    plt.figure()
    observed = ny_data.MRR_2010 if name == "NY" else data.MRR_2010
    true = make_plot(observed)
    ax = make_plot(get_avg_pred(ppc))
    figure = ax.get_figure()  
    figure.savefig(name + "_distplot.png")
    plt.close()

def predict_and_save(X, y, name, trace, model):
    n_tracts = len(X.GIDTR.values)
    new_idx = [i for i in range(n_tracts)]
    ppc = get_pred(X, y, new_idx, trace, model)
    print("{} shape".format(name), ppc['mrr_like'].shape)
    X_with_pred = add_predictions_to_X(X, ppc)
    X_with_pred.to_csv(name+"_csv.csv")
    make_figures(trace, ppc, name)

def make_model():
    with pm.Model() as hierarchical_model:
        ## Normal distribution for priors 
        mu_a = pm.Normal('mu_a', mu=0., sd=100)
        sigma_a = pm.Normal('sigma_a', 5.)

        mu_bs = [pm.Normal('mu_'+parameters[i], mu=0, sd=100) for i in range(len(parameters))]
        sigma_bs = [pm.Normal('sigma_'+parameters[i], 5.) for i in range(len(parameters))]

        a = pm.Normal('constant', mu=mu_a, sd=sigma_a, shape=num_items)

        bs = []
        for i in range(len(parameters)):   
            #normal distribution 
            bs.append(pm.Normal(parameters[i], mu=mu_bs[i], sd=sigma_bs[i], shape=num_items))

        # Model error
        eps = pm.Normal('eps', 5.)

        mrr_est = a[idx_shared]

        for i in range(len(parameters)): 
            mrr_est += bs[i][idx_shared] * X_shared[i]
            # Data likelihood
        mrr_like = pm.Normal('mrr_like', mu=mrr_est,sd=eps, observed=y_train.values) 
    return hierarchical_model 

def train_model(hierarchical_model):
    with hierarchical_model:
        hierarchical_trace = pm.sample(sample, tune=tune, target_accept=.9)
    return hierarchical_trace

try: 
    sample = int(sys.argv[1])
    tune =int(sys.argv[2])
except: 
    print("USAGE: python main.py <sample> <tune> ") 
    sys.exit(2)

path = "National_2010.csv"

data = pd.read_csv(path, encoding="latin-1")

parameters = ["Self_Response_Rate_ACS_13_17","pct_URBAN_CLUSTER_POP_CEN_2010","pct_NH_AIAN_alone_CEN_2010","pct_Not_HS_Grad_ACS_13_17","pct_College_ACS_13_17","pct_Civ_emp_16p_ACS_13_17","pct_Civ_emp_16_24_ACS_13_17","pct_Children_in_Pov_ACS_13_17","pct_Schl_Enroll_3_4_ACS_13_17","pct_Sngl_Prns_HHD_CEN_2010","pct_HHD_PPL_Und_18_CEN_2010","pct_HHD_Moved_in_ACS_13_17","pct_Tot_Occp_Units_ACS_13_17","pct_Single_Unit_ACS_13_17","pct_HHD_w_Broadband_ACS_13_17"]
info = ['MRR_2010', 'Tract', 'GIDTR', 'County', "State_name", "State"]

data = pd.concat([data[parameters], data[info]], axis=1)
data = data.fillna(0)

state_names = data['State_name'].unique()
state_to_data =  {state: data.loc[data['State_name'] == state] for state in state_names}


data = data.sample(n=15000, random_state=1) 
print(data.shape) 

num_items = len(np.unique(data.GIDTR.values))

X_train, X_test, y_train, y_test = train_test_split(data, data.MRR_2010, test_size=0.2)


X_shared = [shared(np.asarray(X_train[parameters[i]].values)) for i in range(len(parameters))]
y_shared = shared(np.asarray(y_train))

n_tracts = len(X_train.GIDTR.values)
tract_idx = [i for i in range(n_tracts)]
idx_shared = shared(np.asarray(tract_idx))


try: 
    model = make_model()

    trace = train_model(model)
except Exception as e: 
    print("An exception was caught: ", e)


h_waic = pm.waic(trace, model)
f= open("waic.txt", "w+")
f.write(str(h_waic)) 
f.close() 

## Predict for train, test 
predict_and_save(X_train, y_train, "train", trace, model)
predict_and_save(X_test, y_test, "test", trace, model)


## Predict for all states
for state_name in state_names: 
    state_data = state_to_data[state_name] 
    predict_and_save(state_data, state_data.MRR_2010, state_name, trace, model)



